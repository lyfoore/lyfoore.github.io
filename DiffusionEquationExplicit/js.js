function stairsFunc(x_min, x_max, N) {      // N - like N in the grid: x = [i_0, i_1, ... , i_N]

    let U0 = new Array(N+1);     // So sum length is N+1

    for (let i = 0; i < x_min; i++) {       // Left bottom of stair
        U0[i] = 0;
    }

    for (let i = x_min; i <= x_max; i++) {  // Top of stair
        U0[i] = 1;
    }

    for (let i = x_max + 1; i <= N; i++) {  // Right bottom of stair
        U0[i] = 0;
    }

    return U0;
}


function drawStep(N, mass, ground, top) {
    ctx.clearRect(0, 0 , c.width + 1, c.height + 1);
    ctx.beginPath();
    ctx.strokeStyle = '#f00';
    ctx.moveTo(0, ground + mass[0]);
    for (let i = 0; i <= N; i++) {
        ctx.lineTo(c.width*i/N,  ground + (-1) * mass[i] * top);
    }
    ctx.stroke();
}


function gaussExplicitStep(U) {
    let dt = 1/M;
    let dx = 1/N;
    let U0 = [...U];

    for (let i = 1; i < N; i++) {
        U[i] = D * (U0[i+1] - 2*U0[i] + U0[i-1]) * dt / dx / dx + U0[i];
    }

    U[0] = U[1];                                       // Граничные
    U[N] = U[N-1];                                     // условия

    return U;
}


function gaussExplicitDraw(U) {
    let U2 = gaussExplicitStep(U);
    drawStep(N, U2, lowerPoint, highestPoint);
    window.requestAnimationFrame(() => {gaussExplicitDraw(U2)});
    // return(U2);
}


function init() {
    c = document.getElementById('plot');
    let Restart = document.getElementById("Restart");
    Restart.onclick = () => {start()};
    ctx = c.getContext('2d');
    lowerPoint = c.height * 5/6;
    highestPoint = c.height * 4/6;

    let Slider = document.getElementById("Slider");
    Slider.min = 0.001;
    Slider.max = 0.01;
    Slider.step = 0.0001;
    D = Slider.value;
    Slider.oninput = () => {D = Slider.value};
}


function start() {

    init();

    let U1 = gaussExplicitStep(stairsFunc(xmin, xmax, N));

    window.requestAnimationFrame(() => {gaussExplicitDraw(U1)});

}


let c;
let ctx;
let lowerPoint, highestPoint;
let D;                                    // Коэффициент диффузии
const xmin = 66;
const xmax = 134;
const N = 200;
const M = 1000;

window.addEventListener("load", () => {alert('Loaded!')}, false); // Test
window.addEventListener("load", () => {start()}, false)
