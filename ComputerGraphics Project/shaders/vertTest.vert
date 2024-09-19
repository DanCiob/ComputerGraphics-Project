#version 450
const int num = 3; 
layout(binding = 0) uniform UniformBufferObject {
    mat4 model;
    mat4 viewProj;
    vec3 selected;
} ubo;

layout(location = 0) in vec3 inPosition;
layout(location = 1) in vec2 UV;
layout(location = 2) in vec3 norm; 

layout(location = 0) out vec2 fragUV;
layout(location = 1) out vec3 fragPos;
layout(location = 2) out vec3 fragNorm;
layout(location = 3) out vec3 selected;

void main() { 
    int i = gl_InstanceIndex; 
    gl_Position = ubo.viewProj * ubo.model * vec4(inPosition, 1.0);
    
    fragPos = (ubo.model * vec4(inPosition, 1.0)).xyz;
    fragNorm =  norm;
    fragUV = UV;
    selected = ubo.selected; 
}