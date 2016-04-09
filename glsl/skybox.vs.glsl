varying vec3 interpolatedNormal;
varying vec3 interpolatedPosition;
uniform mat4 transMat;

void main() {
    interpolatedNormal = normal;
    interpolatedPosition = vec3(transMat * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
