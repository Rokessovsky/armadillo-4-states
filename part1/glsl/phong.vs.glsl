
uniform vec3 spherePosition;


out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 viewPosition;

void main() {

    viewPosition = vec3(viewMatrix * modelMatrix * vec4(position, 1.0));


    vec3 spherePos = vec3(viewMatrix * vec4(spherePosition, 1.0));
    lightDirection = normalize(spherePos - viewPosition);

    interpolatedNormal = normalize(normalMatrix* normal);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}