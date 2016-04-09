varying vec3 interpolatedNormal;
varying vec3 interpolatedPosition;
uniform samplerCube texUnit;

void main() {
    vec3 vecN = normalize(interpolatedNormal);
    vec3 vecV = normalize(interpolatedPosition - cameraPosition);
    vec3 vecR = reflect(vecV, vecN);
    vecR = vec3(-vecR.x, vecR.y, vecR.z);
    
    vec4 tex = textureCube(texUnit, vecR);
    gl_FragColor = tex;
}
