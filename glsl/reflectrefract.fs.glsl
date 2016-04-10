varying vec3 interpolatedNormal;
varying vec3 interpolatedPosition;
uniform samplerCube texUnit;

void main() {
    vec3 vecN = normalize(interpolatedNormal);
    vec3 vecV = normalize(interpolatedPosition - cameraPosition);
    
    // reflection
    vec3 vecReflect = reflect(vecV, vecN);
    vecReflect = vec3(-vecReflect.x, vecReflect.y, vecReflect.z);
    vec4 RFLcolor = textureCube(texUnit, vecReflect);
    
    // refraction
    vec3 R = refract(vecV, vecN, 1.05);
    R = vec3(-R.x, R.y, R.z);
    vec3 G = refract(vecV, vecN, 1.08);
    G = vec3(-G.x, G.y, G.z);
    vec3 B = refract(vecV, vecN, 1.11);
    B = vec3(-B.x, B.y, B.z);
    vec4 RFRcolor = vec4(textureCube(texUnit, R).r,
                         textureCube(texUnit, G).g,
                         textureCube(texUnit, B).b,
                         1.0);
    
    float K = (1.0 - pow(0.55, 2.0)) * (1.0 - pow(max(0.0, dot(vecV, vecN)), 2.0));
    vec4 color = (1.0 - K) * RFRcolor + K * RFLcolor;
    
    gl_FragColor = color;
}
