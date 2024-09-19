
/**************
 Compute the world view and projection matrices, as described below

 WARNING!
 Since it is a C program, you can use for loops and functions if you think they can be helpful in your solution.
 However, please include all your code in this file, since it will be put in an automatic correction process
 for the final evaluation. Please also be cautious when using standard libraries and symbols, since they
 might not be available in all the development environments (especially, they might not be available
 in the final evaluation environment, preventing your code from compiling).
 This WARNING will be valid far ALL THE ASSIGNMENTs, but it will not be repeated in the following texts,
 so please remember these advices carefully!

***************/
glm::mat4 MakeViewProjectionLookInDirection(glm::vec3 Pos, float Yaw, float Pitch, float Roll, float FOVy, float Ar, float nearPlane, float farPlane) {
	// Create a View Projection Matrix with the following characteristics:
	// Projection:
	//	- Perspective with:
	//	- Fov-y defined in formal parameter >FOVy<
	//  - Aspect ratio defined in formal parameter >Ar<
	//  - Near Plane distance defined in formal parameter >nearPlane<
	//  - Far Plane distance defined in formal parameter >farPlane<

	//projection matrix 
	glm::mat4 Mp;
	Mp = glm::perspective(FOVy, Ar, nearPlane, farPlane); //fovY is already in radians
	Mp[1][1] *= -1;

	// View:
	//	- Use the Look-In-Direction model with:
	//	- Camera Positon defined in formal parameter >Pos<
	//	- Looking direction defined in formal parameter >Yaw<
	//	- Looking elevation defined in formal parameter >Pitch<
	//	- Looking rool defined in formal parameter >Roll<
	glm::mat4 Mv;
	glm::mat4 ID = glm::mat4(1.0f);

	Mv =
		glm::rotate(ID,- Roll, glm::vec3(0.0f, 0.0f, 1.0f)) *
		glm::rotate(ID, -Pitch, glm::vec3(1.0f, 0.0f, 0.0f)) *
		glm::rotate(ID, -Yaw, glm::vec3(0.0f, 1.0f, 0.0f)) *
		glm::translate(ID, (Pos *= -1.0f));
	

	glm::mat4 Mvp = Mp * Mv; 
	return Mvp; 
}

glm::mat4 MakeViewProjectionLookAt(glm::vec3 Pos, glm::vec3 Target, glm::vec3 Up, float Roll, float FOVy, float Ar, float nearPlane, float farPlane) {
	// Create a View Projection Matrix with the following characteristics:
	// Projection:
	//	- Perspective with:
	//	- Fov-y defined in formal parameter >FOVy<
	//  - Aspect ratio defined in formal parameter >Ar<
	//  - Near Plane distance defined in formal parameter >nearPlane<
	//  - Far Plane distance defined in formal parameter >farPlane<

	//projection matrix 
	glm::mat4 Mp;
	Mp = glm::perspective(FOVy, Ar, nearPlane, farPlane);
	Mp[1][1] *= -1;

	// View:
	//	- Use the Look-At model with:
	//	- Camera Positon defined in formal parameter >Pos<
	//	- Camera Target defined in formal parameter >Target<
	//	- Up vector defined in formal parameter >Up<
	//	- Looking rool defined in formal parameter >Roll<
	glm::mat4 Mv; 

	Mv = glm::lookAt(Pos, Target, Up); 

	glm::mat4 Mvp = Mp * Mv;
	return Mvp;
}

glm::mat4 MakeWorld(glm::vec3 Pos, float Yaw, float Pitch, float Roll) {
	// Create a World Matrix with the following characteristics:
	//	- Object Positon defined in formal parameter >Pos<
	//	- Euler angle rotation yaw defined in formal parameter >Yaw<
	//	- Euler angle rotation pitch defined in formal parameter >Pitch<
	//	- Euler angle rotation roll defined in formal parameter >Roll<
	//  - Scaling constant and equal to 1 (and not passed to the procedure)
	
	glm::mat4 ID = glm::mat4(1.0f);
	glm::mat4 Mw;
	Mw =
		glm::translate(ID, Pos) *
		glm::rotate(ID, Yaw, glm::vec3(0.0f, 1.0f, 0.0f)) *
		glm::rotate(ID, Pitch, glm::vec3(1.0f, 0.0f, 0.0f)) *
		glm::rotate(ID, Roll, glm::vec3(0.0f, 0.0f, 1.0f))*
		glm::scale(ID, glm::vec3(1.0f, 1.0f, 1.0f));

	return Mw;
}