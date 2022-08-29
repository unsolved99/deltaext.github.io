    // precision mediump float;

    // // uniform float vpw; // Width, in pixels
    // // uniform float vph; // Height, in pixels
    // uniform float scaleFactor; //
    // uniform float alpha; //


    // uniform vec2 offset; // e.g. [-0.023500000000000434 0.9794000000000017], currently the same as the x/y offset in the mvMatrix
    // uniform vec2 pitch;  // e.g. [50 50]
    // uniform vec3 gridColor;  // e.g. [50 50]

    // void main() {
    //     // float mp = 0.00392156862745098;
    //     // float lX = gl_FragCoord.x / vpw;
    //     // float lY = gl_FragCoord.y / vph;

    //     // float scaleFactor = 10000.0;

    //     float offX = (scaleFactor * offset[0]) + gl_FragCoord.x;
    //     float offY = (scaleFactor * offset[1]) + (1.0 - gl_FragCoord.y);
        

    //     if (int(mod(offX, pitch[0])) == 0 ||
    //         int(mod(offY, pitch[1])) == 0
    //         ) {
    //         // gl_FragColor = vec4(gridColor  , alpha);
    //         gl_FragColor = vec4(gridColor * alpha, alpha);
    //     } else {
    //         gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    //     }
    // }
/////////////////////////////////////////////////////////////////

precision mediump float;
uniform float iResolution;
uniform float scaleFactor;
uniform float alpha;
uniform vec2 offset;
// uniform vec2 pitch;
uniform vec3 gridColor;
// uniform float gridLineThickness;
float miv(vec2 a){return min(a.y,a.x);}//return max domain of vector.
float miv(vec3 a){return min(a.z,miv(a.xy));}
float miv(vec4 a){return min(miv(a.zw),miv(a.xy));}
#define mav(a) -miv(-a)
#define grid(u) mav(abs(fract(u)*2.-1.))

float zoom = 10.0;//2d scaling (ширина квадрата)

void main(){
    vec2 uv = (offset + gl_FragCoord.xy) / (vec2(500) * scaleFactor);
    // float zoom = 10.0;//2d scaling (ширина квадрата)
    float thick = (scaleFactor/3.0) + 2.0;//line thickness in screenspace pixels (hairline)
    
    //      1.5*goldenRatio       puts aliasing to the test.
    //thick=1.5*(sqrt(5.)*.5+.5);
        
    float gridLineThickness = zoom * thick / (scaleFactor*500.0);
    float sm = smoothstep(1.-gridLineThickness,1., grid(uv * zoom));
	gl_FragColor = vec4( gridColor * sm * alpha, 0);
	// gl_FragColor = vec4( sm, 0, 0, 0);
}