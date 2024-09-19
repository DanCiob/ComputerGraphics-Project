#version 450
#extension GL_ARB_separate_shader_objects : enable

layout(location = 0) in vec3 TexCoords;
layout(location = 0) out vec4 outColor;
layout(binding = 1) uniform sampler2D skybox;

const float PI = 3.14159265;

void main() {
  // convert from cartesian to spherical coordinates
  // kind of like manually creating the UV

  // divide by PIs are to convert to unit of 1
  float yaw = -(atan(TexCoords.x, TexCoords.z)/PI/2);
  // the skybox texture is only above the horizon, so we multiply by 1.5 with 0.25 offset to "lift" it up a bit
  // in other words, the texture repeats 1.5 times, but this is what we want
  float pitch = -(atan(TexCoords.y, sqrt(TexCoords.x*TexCoords.x+TexCoords.z*TexCoords.z))/PI*1.5 + 0.25);
  outColor = texture(skybox, vec2(yaw, pitch)); 
}