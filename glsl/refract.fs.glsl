varying vec3 interpolatedNormal;
varying vec3 interpolatedPosition;
uniform samplerCube texUnit;

void main() {
    vec3 vecN = normalize(interpolatedNormal);
    vec3 vecV = normalize(interpolatedPosition - cameraPosition);
    vec3 vecR = refract(vecV, vecN, 1.1);
    vecR = vec3(-vecR.x, vecR.y, vecR.z);
    
    vec4 tex = textureCube(texUnit, vecR);
    gl_FragColor = tex;
}
