// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 spherePosition;

void main() {


    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position + spherePosition, 1.0);

}
