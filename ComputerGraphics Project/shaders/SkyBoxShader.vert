#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(binding = 0) uniform UniformBufferObject { mat4 mvpMat; } ubo;

layout(location = 0) in vec3 inPosition;
layout(location = 0) out vec3 TexCoords;

void main()
{
    // Pass the 3D position as texture coordinates for the cubemap
    TexCoords = inPosition;

    // Compute the final vertex position in clip space
    vec4 pos = ubo.mvpMat * vec4(inPosition, 1.0);
    gl_Position = pos.xyww;
}