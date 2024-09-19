#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec2 fragTexCoord;

layout(location = 0) out vec4 outColor;

layout(binding = 0) uniform sampler2D texSampler;
layout(binding = 1) uniform showText {
	float show; 
}show; 

const vec4 FGcolor = vec4(1.0f);
const vec4 BGcolor = vec4(0.0f, 0.0f, 0.0f, 1.0f);
const vec4 SHcolor = vec4(0.0f, 0.0f, 0.0f, 0.5f);

void main() {
	vec4 Tx = texture(texSampler, fragTexCoord);
	if(show.show == 1.0f){
		outColor = Tx.r * FGcolor+ Tx.g * BGcolor + Tx.b * SHcolor;	
	}
	else outColor = vec4(1.0f, 0.0f,0.0f,0.0f); 
}