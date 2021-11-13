// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 spherePosition;

out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 pointPosition;

void main() {

    pointPosition = mat3(modelMatrix) * position;

    vec3 spherePos = vec3(viewMatrix * vec4(spherePosition, 1.0));
    lightDirection = normalize(spherePos - vec3(viewMatrix * modelMatrix * vec4(position, 1.0)));


    interpolatedNormal = normalize(normalMatrix * normal);

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}