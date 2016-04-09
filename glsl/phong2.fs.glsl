varying vec3 Vnormal;
varying vec3 VviewPos;
varying vec3 Vlight;

uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;
uniform vec3 kAmbient;
uniform vec3 kDiffuse;
uniform vec3 kSpecular;
uniform float shininess;

void main() {
    
    // Illumination Ambient
    vec3 ambient = ambientColor * kAmbient;
    
    // Illumination Diffuse
    vec3 normalVCS = normalize(Vnormal);
    vec3 lightVCS = normalize(Vlight);
    float diffuseAngle = dot(normalVCS, lightVCS);
    vec3 diffuse = kDiffuse * lightColor * diffuseAngle;
    
    // Illumination Specular (Phong)
    vec3 viewVCS = normalize(-VviewPos);
    vec3 reflectVCS = reflect(-lightVCS, normalVCS);
    float specAngle = dot(viewVCS, reflectVCS);
    float n = pow(specAngle, shininess);
    vec3 specular = kSpecular * lightColor * n;
 
    
    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);

}