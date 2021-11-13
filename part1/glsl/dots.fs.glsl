uniform float ticks;

in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 pointPosition;

void main() {

    float intensity = max(dot(normalize(interpolatedNormal), normalize(lightDirection)), 0.0);

    vec3 color1 = vec3(1.0, 0.0, 1.0);
    vec3 color2 = vec3(0.0, 1.0, 1.0);

    float modX = mod(pointPosition.x, 1.0) - 0.5;
    float modY = mod(fract(pointPosition.y + fract(ticks)), 1.0) - 0.5;
    float modZ = mod(pointPosition.z, 1.0) - 0.5;
    float discardOrNot = pow(modX, 2.0) + pow(modY, 2.0) + pow(modZ, 2.0);

    if (discardOrNot <= 0.125) {
        gl_FragColor = vec4(mix(color2,color1,intensity), 1.0);
    } else {
        discard;
    }
}