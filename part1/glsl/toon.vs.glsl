// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 spherePosition;

out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 viewPosition;
out float fresnel;

void main() {

    viewPosition = vec3(viewMatrix * modelMatrix * vec4(position, 1.0));


    lightDirection = vec3(viewMatrix * vec4(spherePosition, 1.0)) - viewPosition;

    // Interpolate the normal
    interpolatedNormal = normalMatrix * normal;


    vec4 viewDirection = -normalize(vec4(viewPosition, 1.0)); // Point at camera/eye
    vec4 viewNormal = vec4(normalMatrix * normal, 0.0);
    fresnel = dot(normalize(viewNormal), viewDirection);


    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}