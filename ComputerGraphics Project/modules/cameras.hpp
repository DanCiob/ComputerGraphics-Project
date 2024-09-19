
#define GLM_FORCE_DEPTH_ZERO_TO_ONE
#define GLM_FORCE_RADIANS
#include "glm/gtx/transform.hpp"
#include "glm/glm.hpp"
#include "glm/gtc/matrix_transform.hpp"
#include "glm/gtx/transform2.hpp"

	
	glm::mat4 DifferentViews(int num){
	// Ortogonal Front
	// this is the only one correct, and that should not be modified

	glm::mat4 M;
	float a = 4.0f / 3.0f;

			
	if(num == 1){

	// Dimetric, with an angle of 20 degree
	M = glm::mat4(1.0f / 20.0f, 0, 0, 0, 0, - a / 20.0f, 0, 0, 0, 0, 1.0f / (-500.0f - 500.0f), 0, 0, 0, (-500.0f) / (-500.0f - 500.0f), 1) *
		glm::rotate(glm::mat4(1.0f), glm::radians(20.0f), glm::vec3(1.0f, 0.0f, 0.0f)) *
		glm::rotate(glm::mat4(1.0f), glm::radians(45.0f), glm::vec3(0.0f, 1.0f, 0.0f));

	}else if(num == 2){
	
	// Trimetric, with an angle of alpha of 30 degree, and beta of 60 degrees
	M = glm::mat4(1.0f / 20.0f, 0, 0, 0, 0, - a/ 20.0f, 0, 0, 0, 0, 1.0f / (-500.0f - 500.0f), 0, 0, 0, -500.0f / (-500.0f - 500.0f), 1)* 
		glm::rotate(glm::mat4(1.0f), glm::radians(60.0f), glm::vec3(1.0f, 0.0f, 0.0f))* 
	 	glm::rotate(glm::mat4(1.0f), glm::radians(30.0f), glm::vec3(0.0f, 1.0f, 0.0f));

	}else if(num ==3){
	
	// Create a Cabinet projection, with the z axis at an angle of 45 degrees
	
    M = glm::mat4(1.0f / 20.0f,0,0,0,  0,- a / 20.0f,0,0,   0,0,1.0f/(- 500.0f -500.0f),0, 0,0, - 500.0f/(-500.0f -500.0f),1) *
	    glm::shearZ3D(glm::mat4(1.0f), - 0.5f * 0.5f, -0.5f * 0.5f);

	}

	return M;
	
	}
