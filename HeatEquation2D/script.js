function stairsFunc(x_min, x_max) {                  // N - like N in the grid: x = [i_0, i_1, ... , i_N]

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

function stairsFunc2D(x_min, x_max, y_min, y_max) {              // N - like N in the grid: x = [i_0, i_1, ... , i_N]
    let U0x = stairsFunc(x_min, x_max);
    let U0y = stairsFunc(y_min, y_max);
    let U0 = new Array(N+1);
    for (let i = 0; i <= N; i++) {
        U0[i] = new Array(M+1);                              // Create array[N+1][M+1] of undefined
    }

    for (let i = 0; i <= N; i++) {
        for (let j = 0; j <= M; j++) {
            U0[i][j] = U0x[i] * U0y[j];
        }
    }
    return U0;
}

function gaussSeidelLine2D(base, U0) {
    let U = [...U0];
    let Gamma = 1 + 2*D*dt*(dy*dy+dx*dx)/dx/dy/dx/dy;
    for (let i = 1; i < N; i++) {
        for (let j = 1; j < M; j++) {
            U[i][j] = (D*dt*((U[i+1][j]+U[i-1][j])/dx/dx+(U[i][j-1]+U[i][j+1])/dy/dy) + base[i][j])/Gamma;
        }
        U[i][0] = U[i][1];               // Граничные
        U[i][N] = U[i][N-1];             // условия
    }
    U[0] = U[1];
    U[N] = U[N-1];
    return U;
}

function gaussSeidelStep2D(base, U0) {
    let U = [...U0];
    let U1 = gaussSeidelLine2D(U, U);
    let i = 0;
    while(i < 10) {
        U = [...U1];
        U1 = gaussSeidelLine2D(base, U);
        i++;
    }
    return U1;
}

function step2D(U) {
    let source = [];
    for (let row of U) {
        for (let item of row) {
            source = source.concat(item*255, ...gbA);
        }
    }
    return new ImageData(new Uint8ClampedArray(source), N+1, M+1);
}

function drawStep2D(context, U) {
    context.putImageData(step2D(U), 0, 0);
}


/////////////////////////////////////////////////////////////

function step1D(U) {
    let source = [];
    for (let item of U) {
        source = source.concat(item*255, ...gbA);         // item <=1
    }
    return new ImageData(source, N+1);
}

function drawStep1D(canvas, U) {
    canvas.putImageData(step1D(U), 0, 0);
}

/////////////////////////////////////////////////////////////

function gaussSeidelDraw2D(base) {
    let U0 = [...base];
    let U1 = gaussSeidelStep2D(U0, U0);
    drawStep2D(ctxDiag, U1);
    window.requestAnimationFrame(() => {gaussSeidelDraw2D(U1)});
}

function start() {
    init();
    let stairs = stairsFunc2D(xmin, xmax, ymin, ymax);
    drawStep2D(ctxDiag, stairs);
    gaussSeidelDraw2D(stairs);
}

// Адаптивность под 1D и 2D //
// if (U[i].length === 1) {
//     step1D();
// }
// else {
//     step2D();
// }
//////////////////////////////


// Преобразование массива U в массив ImageData.data //
// let arr2d = [
//     [1,2,3],
//     [4,5,6],
//     [7,8,9],
// ];
//
// let gbA = [0, 0, 255];
//
// let arr1d = [];
//
// for (let row of arr2d) {
//     for (let item of row) {
//         arr1d = arr1d.concat(item, ...gbA);
//     }
// }
//////////////////////////////////////////////////////

function init() {
    diagram = document.getElementById('diagram');
    ctxDiag = diagram.getContext('2d');
    let Restart = document.getElementById("Restart");
    Restart.onclick = () => {start()};
    let Slider = document.getElementById("Slider");
    Slider.min = 0.0001;
    Slider.max = 0.05;
    Slider.step = 0.00001;
    D = Slider.value;
    Slider.oninput = () => {D = Slider.value};
}

const N = 30;
const M = 30;
const T = 100;
const xmin = 10;
const xmax = 20;
const ymin = 10;
const ymax = 20;
const dt = 1/T;
const dx = 1/N;
const dy = 1/M;
let D;
let diagram;
let ctxDiag;


const gbA = [0, 0, 255];

let stairs = stairsFunc2D(xmin, xmax, ymin, ymax);
console.log(stairs === stairsFunc2D(xmin, xmax, ymin, ymax));

window.addEventListener("load", () => {alert('Loaded!')}, false); // Test
window.addEventListener("load", () => {start()}, false);   // Запуск решения методом Гаусса-Зейделя
