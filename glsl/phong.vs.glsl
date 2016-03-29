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

	// ADJUST THESE VARIABLES TO PASS PROPER DATA TO THE FRAGMENTS
    vec4 newPos = modelViewMatrix * vec4(position, 1.0);
    
    VviewPos = newPos.xyz;
    Vnormal = normalMatrix * normal;
    vec4 light = viewMatrix * vec4(lightPosition, 0.0);
    Vlight = light.xyz;
    
    
    
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);

}