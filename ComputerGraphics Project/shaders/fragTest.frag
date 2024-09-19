#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec2 fragUV;
layout(location = 1) in vec3 fragPos;
layout(location = 2) in vec3 fragNorm;
layout(location = 3) in vec3 selected; 

layout(location = 0) out vec4 outColor;

layout(binding = 1) uniform sampler2D tex;

const int numOfLights = 10;

layout(binding = 2) uniform GlobalUniformBufferObject {
	vec3 lightDir[numOfLights];
	vec3 lightPos[numOfLights];
	vec4 lightColor[numOfLights];
	vec3 lightType[numOfLights]; 
	vec3 eyePos;
	float cosIn[numOfLights];
	float cosOut[numOfLights];
	} gubo;

////////////////////////
//code from a07 shader//
///////////////////////

vec3 direct_light_dir(vec3 pos, int i) {
	// Direct light - direction vector
	// Direction of the light in <gubo.lightDir[i]>
	return gubo.lightDir[i] ;
}

vec3 direct_light_color(vec3 pos, int i) {
	// Direct light - color
	// Color of the light in <gubo.lightColor[i].rgb>
	return gubo.lightColor[i].rgb; 
}

vec3 point_light_dir(vec3 pos, int i) {
	// Point light - direction vector
	// Position of the light in <gubo.lightPos[i]>
	
	//this is the position of the light
	vec3 p = gubo.lightPos[i]; 
	vec3 dir = normalize((p - pos));

	return dir;
}

vec3 point_light_color(vec3 pos, int i) {
	// Point light - color
	// Color of the light in <gubo.lightColor[i].rgb>
	// Scaling factor g in <gubo.lightColor[i].a>
	// Decay power beta: constant and fixed to 2.0
	// Position of the light in <gubo.lightPos[i]>

	vec3 color =  gubo.lightColor[i].rgb; 
	float g = gubo.lightColor[i].a; 
	float decayFactor = 2.0f; 
	vec3 p = gubo.lightPos[i]; 
	
	float distance = distance(p, pos); 

	vec3 result = color * pow((g /distance), decayFactor);  
	return result;
}

vec3 spot_light_dir(vec3 pos, int i) {
	// Spot light - direction vector
	// Direction of the light in <gubo.lightDir[i]>
	// Position of the light in <gubo.lightPos[i]>

	return point_light_dir(pos, i);
}

vec3 spot_light_color(vec3 pos, int i) {
	// Spot light - color
	// Color of the light in <gubo.lightColor[i].rgb>
	// Scaling factor g in <gubo.lightColor[i].a>
	// Decay power beta: constant and fixed to 2.0
	// Position of the light in <gubo.lightPos[i]>
	// Direction of the light in <gubo.lightDir[i]>
	// Cosine of half of the inner angle in <gubo.cosIn>
	// Cosine of half of the outer angle in <gubo.cosOut>
	
	vec3 color =  gubo.lightColor[i].rgb; 
	float g = gubo.lightColor[i].a; 
	float decayFactor = 2.0f; 
	vec3 p = gubo.lightPos[i]; 
	vec3 dir = gubo.lightDir[i];
	float cosIn = gubo.cosIn[i]; 
	float cosOut = gubo.cosOut[i];

	float distance = distance(pos,p); 
	float cosAlpha = dot(spot_light_dir(pos, i), dir); 
	
	float clampResult = clamp(((cosAlpha - cosOut) / (cosIn - cosOut)), 0, 1); 

	vec3 result = color * pow((g /distance), decayFactor)* clampResult;  

	return result;
}

vec3 BRDF(vec3 Albedo, vec3 Norm, vec3 EyeDir, vec3 LD) {
// Compute the BRDF, with a given color <Albedo>, in a given position characterized bu a given normal vector <Norm>,
// for a light direct according to <LD>, and viewed from a direction <EyeDir>
	vec3 Diffuse;
	vec3 Specular;
	Diffuse = Albedo * max(dot(Norm, LD),0.0f);
	Specular = vec3(pow(max(dot(EyeDir, -reflect(LD, Norm)),0.0f), 160.0f));
	
	return Diffuse + Specular;
}

void main() {

		vec3 Norm = normalize(fragNorm);
		vec3 EyeDir = normalize(gubo.eyePos - fragPos);
		vec3 Albedo = texture(tex, fragUV).rgb;

		vec3 LD;	// light direction
		vec3 LC;	// light color

    	//this is going to contain the pixel final color
		vec3 RendEqSol = vec3(0);

		
		for(int i = 0; i < 10; i++){
			//having an else statement will make this useless
			if(gubo.lightType[i].x == 1){
				LD = direct_light_dir(fragPos, i);
				LC = direct_light_color(fragPos, i);
			}
			if(gubo.lightType[i].y == 1){
				LD = point_light_dir(fragPos, i);
				LC = point_light_color(fragPos, i);
			}
			if(gubo.lightType[i].z == 1){
				LD = spot_light_dir(fragPos, i);
				LC = spot_light_color(fragPos, i);
			}
			RendEqSol += BRDF(Albedo, Norm, EyeDir, LD) * LC ; 
		} 	

		//from a07 code
		// Indirect illumination simulation
		// A special type of non-uniform ambient color, invented for this course
		const vec3 cxp = vec3(1.0,0.5,0.5) * 0.2;
		const vec3 cxn = vec3(0.9,0.6,0.4) * 0.2;
		const vec3 cyp = vec3(0.3,1.0,1.0) * 0.2;
		const vec3 cyn = vec3(0.5,0.5,0.5) * 0.2;
		const vec3 czp = vec3(0.8,0.2,0.4) * 0.2;
		const vec3 czn = vec3(0.3,0.6,0.7) * 0.2;
		
		vec3 Ambient =((Norm.x > 0 ? cxp : cxn) * (Norm.x * Norm.x) +
					   (Norm.y > 0 ? cyp : cyn) * (Norm.y * Norm.y) +
					   (Norm.z > 0 ? czp : czn) * (Norm.z * Norm.z)) * Albedo;
		RendEqSol += Ambient * 0.05 ; 


		vec3 mapped = RendEqSol / (RendEqSol + vec3(1.0));	

		if(selected.x == 1.0f){
			outColor = vec4(1.0f); 
		}else{
			outColor = vec4(mapped, 1.0f); 
		}		
    	//outColor = clamp(vec4(RendEqSol, 1.0f) + vec4(selected,1.0f),0,1);
	
    

}