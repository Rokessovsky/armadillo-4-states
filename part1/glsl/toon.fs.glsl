
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 viewPosition;
in float fresnel;

void main() {

    float intensity = max(dot(normalize(interpolatedNormal), normalize(lightDirection)), 0.0);


    if (intensity < 0.25) {
        gl_FragColor = vec4(0.7255, 0.0275, 0.0275, 1.0);
    } else if (intensity < 0.5) {
        gl_FragColor = vec4(0.9529, 0.2039, 0.0157, 1.0);
    } else if (intensity < 0.75) {
        gl_FragColor = vec4(0.9922, 0.5373, 0.0196, 1.0);
    } else {
        gl_FragColor = vec4(0.9922, 0.7647, 0.0196, 1.0);
    }

    if (fresnel < 0.2) {
        gl_FragColor = vec4(0.0,0.0,0.0,1.0);
    }
}