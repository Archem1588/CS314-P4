varying vec3 interpolatedNormal;
varying vec3 interpolatedPosition;

void main() {
    // changing position and normal into view coordinates
    vec3 normalView = normalMatrix * normal;
    vec3 positionView = vec3(modelViewMatrix * vec4(position, 1.0));
    
    interpolatedNormal = normalView;
    interpolatedPosition = positionView;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
