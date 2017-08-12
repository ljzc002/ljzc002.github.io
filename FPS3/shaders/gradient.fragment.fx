precision mediump float;

uniform mat4 worldView;

varying vec4 vPosition;
varying vec3 vNormal;

// Offset position
uniform float offset;
// Colors
uniform vec3 topColor;
uniform vec3 bottomColor;

void main(void) {

    float h = normalize(vPosition + offset).y;

	gl_FragColor = vec4( mix(bottomColor, topColor, max(pow(max(h, 0.0), 1.2), 0.0)), 1.0 );
}
