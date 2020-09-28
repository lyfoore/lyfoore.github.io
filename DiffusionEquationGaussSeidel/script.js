function stairsFunc(x_min, x_max, N) {                  // N - like N in the grid: x = [i_0, i_1, ... , i_N]

    let U0 = new Array(N+1);                 // So sum length is N+1

    for (let i = 0; i < x_min; i++) {                  // Left bottom of stair
        U0[i] = 0;
    }

    for (let i = x_min; i <= x_max; i++) {             // Top of stair
        U0[i] = 1;
    }

    for (let i = x_max + 1; i <= N; i++) {             // Right bottom of stair
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


function eulerExplicitStep(U) {                        // Явный метод Эйлера
    let U0 = [...U];

    for (let i = 1; i < N; i++) {
        U[i] = D * (U0[i+1] - 2*U0[i] + U0[i-1]) * dt / dx / dx + U0[i];
    }

    U[0] = U[1];                                       // Граничные
    U[N] = U[N-1];                                     // условия

    return U;
}


function eulerExplicitDraw(U) {
    let U2 = eulerExplicitStep(U);
    drawStep(N, U2, lowerPoint, highestPoint);
    window.requestAnimationFrame(() => {eulerExplicitDraw(U2)});
    // return(U2);
}


function gaussSeidelLine(base, U0) {                   // Прогонка по слою БЕЗ проверки на условие с эпсилон
    let U = [...U0];
    let x = dx*dx/dt/D;
    for (let i = 1; i < N; i++) {                      // base - j-й слой, U - (j+1)-й слой
        U[i] = (U[i-1] + U[i+1])/(x+2) + base[i]/(1+2/x);
    }
    U[0] = U[1];                                       // Граничные
    U[N] = U[N-1];                                     // условия
    return U;
}


function check(mass0, mass1, epsilon) {
    for (let i = 0; i < mass0.length; i++) {
        let verification = (mass0[i] - mass1[i])**2 < epsilon;
        if (verification === false) {
            return false;
        }
    }
    return true;
}


function gaussSeidelStep(base, U0) {                   // Метод Гаусса-Зейделя
    let U = [...U0];                                   // Прогонка по слою С проверкой на условие с эпсилон
    let U1 = gaussSeidelLine(U, U);
    while(!check(U1, U, epsilon)) {
        U = [...U1];
        U1 = gaussSeidelLine(base, U1);
    }
    return U1;
}


function gaussSeidelDraw(base) {                       // base - j-й слой
    let U0 = [...base];
    let U1 = gaussSeidelStep(U0, U0);
    U0 = [...U1];
    drawStep(N, U0, lowerPoint, highestPoint);
    window.requestAnimationFrame(() => {gaussSeidelDraw(U0)});
}


function init() {
    c = document.getElementById('plot');
    let Restart = document.getElementById("Restart");
    Restart.onclick = () => {startGaussSeidel()};
    // Restart.onclick = () => {startEuler()};
    ctx = c.getContext('2d');
    lowerPoint = c.height * 5/6;
    highestPoint = c.height * 4/6;

    let Slider = document.getElementById("Slider");
    Slider.min = 0.0001;
    Slider.max = 0.05;
    Slider.step = 0.00001;
    D = Slider.value;
    Slider.oninput = () => {D = Slider.value};
}


function startEuler() {

    init();

    let U1 = eulerExplicitStep(stairsFunc(xmin, xmax, N));

    window.requestAnimationFrame(() => {eulerExplicitDraw(U1)});

}

function startGaussSeidel() {
    init();
    let U0 = stairsFunc(xmin, xmax, N);
    gaussSeidelDraw(U0);
}


let c;
let ctx;
let lowerPoint, highestPoint;
let D;                                    // Коэффициент диффузии
const xmin = 34;
const xmax = 68;
const N = 102;
const M = 102;
const dt = 1/M;
const dx = 1/N;
const epsilon = 10e-20;

window.addEventListener("load", () => {alert('Loaded!')}, false); // Test
// window.addEventListener("load", () => {startEuler()}, false);   // Запуск решения явным методом Эйлера
window.addEventListener("load", () => {startGaussSeidel()}, false);   // Запуск решения методом Гаусса-Зейделя

