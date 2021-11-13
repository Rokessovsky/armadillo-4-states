
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;

in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 viewPosition;


void main() {
    

    vec3 aColor = kAmbient * ambientColor;

    float diffuse = max(dot(interpolatedNormal, lightDirection), 0.0);
    vec3 dColor = kDiffuse * diffuseColor * diffuse;

    vec3 bl = reflect(-lightDirection, interpolatedNormal);
    vec3 viewDir = -normalize(viewPosition);
    float specular = pow(max(dot(bl, viewDir),0.0), shininess);
    vec3 specColor = kSpecular * specular * specularColor;

    gl_FragColor = vec4(aColor, 1.0) + vec4(dColor, 1.0) + vec4(specColor, 1.0);
}