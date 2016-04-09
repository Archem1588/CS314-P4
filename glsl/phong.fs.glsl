varying vec3 interpolatedNormal;
varying vec3 interpolatedPosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 lightPosition;
uniform vec3 kAmbient;
uniform vec3 kDiffuse;
uniform vec3 kSpecular;
uniform float shininess;

void main() {
    // ambient
    vec3 ambt = ambientColor * kAmbient;
    
    // diffuse
    vec3 vecN = normalize(interpolatedNormal);
    vec3 vecL = normalize(lightPosition - interpolatedPosition);
    float dotNL = max(0.0, dot(vecN, vecL));
    vec3 diff = lightColor * kDiffuse * dotNL;
    
    // specular
    vec3 vecR = normalize((2.0 * vecN * dotNL) - vecL);
    vec3 vecV = normalize(-interpolatedPosition);
    float dotRV = max(0.0, dot(vecR, vecV));
    vec3 spec = lightColor * kSpecular * pow(dotRV, shininess);
    
    // total illumination
    vec3 colour = ambt + diff + spec;
    
    gl_FragColor = vec4(colour, 1.0);
}
