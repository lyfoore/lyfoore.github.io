function start() {
    alert('Loaded!');
    init();
    boundaryDer();
    drawStep2D(ctxVField, V1);
    gaussSeidelDraw(V1, P);
}


function init() {
    vField = document.getElementById('vField');
    vField.width = M;
    vField.height = N;
    ctxVField = vField.getContext('2d');


}


function initialConditionsV() {               // Conditions for lid-driven cavity flow
    let Vi = [[], []];
    // U-COMPONENT
    // top moving wall
    let topWall = new Array(M+1);
    for (let i = 0; i <= M; i++) {
        topWall[i] = 1;
    }
    // zero velocity in area, excluding the top wall:
    zeroRow = new Array(M+1);
    for (let i = 0; i <= M; i++) {
        zeroRow[i] = 0;
    }
    Vi[0].push(topWall);
    for (let i = 1; i <= N; i++) {
        Vi[0].push(zeroRow);
    }
    // V-COMPONENT
    for (let i = 0; i <= N; i++) {
        Vi[1].push(zeroRow);
    }
    return Vi;
}

function initialConditionsP() {
    let P = [];
    for (let i = 0; i<= N; i++) {
        P.push(zeroRow);
    }
    return P;
}


function step2D(U) {
    let source = [];
    for (let row of U[0]) {
        for (let item of row) {
            source = source.concat(item*255, ...gbA);
            // console.log(item);
        }
    }
    // console.log(source);
    return new ImageData(new Uint8ClampedArray(source), M+1, N+1);
}

function drawStep2D(context, U) {
    context.putImageData(step2D(U), 0, 0);
}

function boundaryDer() {
    for (let i = 0; i<= N; i++) {
        der1.push(zeroRow);
        der2.push(zeroRow);
    }
}


// First equation (for u):
// V1[0][i][j] = ( V0[0][i][j]/dt - V1[1][i][j]*(V1[0][i][j+1]-V1[0][i][j-1])/(2*dy) - 1/rho*(P1[i+1][j]-P1[i-1][j])/(2*dx) + D*((V1[0][i+1][j]+V1[0][i-1][j])/dx/dx + (V1[0][i][j+1] + V1[0][i][j-1])/dy/dy) ) / (1/dt + (V1[0][i+1][j] - V1[0][i-1][j])/(2*dx) + 2*D*(1/dx/dx + 1/dy/dy))
// Second equation (for v):
// V1[1][i][j] = ( V0[1][i][j]/dt - V1[0][i][j]*(V1[1][i+1][j]-V1[1][i-1][j])/(2*dx) - 1/rho*(P1[i][j+1]-P1[i][j-1])/(2*dy) + D*((V1[1][i+1][j]+V1[1][i-1][j])/dx/dx + (V1[1][i][j+1] + V1[1][i][j-1])/dy/dy) ) / (1/dt + (V1[1][i][j+1] - V1[1][i][j-1])/(2*dy) + 2*D*(1/dx/dx + 1/dy/dy))
// Third equation (for the first der):
// der1[i][j] = V1[0][i][j]*(V1[0][i+1][j]-V1[0][i-1][j])/(2*dx) + V1[1][i][j]*(V1[0][i][j+1]-V1[0][i][j-1])/(2*dy)
// Fourth equation (for the second der):
// der2[i][j] = V1[0][i][j]*(V1[1][i+1][j]-V1[1][i-1][j])/(2*dx) + V1[1][i][j]*(V1[1][i][j+1]-V1[1][i][j-1])/(2*dy)
// Fifth equation (for P):
// P1[i][j] = ((P1[i+1][j]+P1[i-1][j])/dx/dx + (P1[i][j+1]+P1[i][j-1])/dy/dy + rho*((der1[i+1][j]-der1[i-1][j])/(2*dx) + (der2[i][j+1]-der2[i][j-1])/(2*dy)))/(2*(1/dx/dx + 1/dy/dy))


function gaussSeidelLineU(V0, V1, P1) {
    for (let i = 1; i < N; i++) {
        for (let j = 1; j < M; j++) {
            V1[0][i][j] = ( V0[0][i][j]/dt - V1[1][i][j]*(V1[0][i][j+1]-V1[0][i][j-1])/(2*dy) - 1/rho*(P1[i+1][j]-P1[i-1][j])/(2*dx) + D*((V1[0][i+1][j]+V1[0][i-1][j])/dx/dx + (V1[0][i][j+1] + V1[0][i][j-1])/dy/dy) ) / (1/dt + (V1[0][i+1][j] - V1[0][i-1][j])/(2*dx) + 2*D*(1/dx/dx + 1/dy/dy));
        }
    }
    return V1[0];
}

function gaussSeidelLineV(V0, V1, P1) {
    for (let i = 1; i < N; i++) {
        for (let j = 1; j < M; j++) {
            V1[1][i][j] = ( V0[1][i][j]/dt - V1[0][i][j]*(V1[1][i+1][j]-V1[1][i-1][j])/(2*dx) - 1/rho*(P1[i][j+1]-P1[i][j-1])/(2*dy) + D*((V1[1][i+1][j]+V1[1][i-1][j])/dx/dx + (V1[1][i][j+1] + V1[1][i][j-1])/dy/dy) ) / (1/dt + (V1[1][i][j+1] - V1[1][i][j-1])/(2*dy) + 2*D*(1/dx/dx + 1/dy/dy));
        }
    }
    return V1[1];
}

function firstDer(V1) {
    for (let i = 1; i < N; i++) {
        for (let j = 1; j < M; j++) {
            der1[i][j] = V1[0][i][j]*(V1[0][i+1][j]-V1[0][i-1][j])/(2*dx) + V1[1][i][j]*(V1[0][i][j+1]-V1[0][i][j-1])/(2*dy);
        }
    }
    return der1;
}

function secondDer(V1) {
    for (let i = 1; i < N; i++) {
        for (let j = 1; j < M; j++) {
            der2[i][j] = V1[0][i][j]*(V1[1][i+1][j]-V1[1][i-1][j])/(2*dx) + V1[1][i][j]*(V1[1][i][j+1]-V1[1][i][j-1])/(2*dy);
        }
    }
    return der2;
}

function gaussSeidelLineP(P1, der1, der2) {
    for (let i = 1; i < N; i++) {
        for (let j = 1; j < M; j++) {
            P1[i][j] = ((P1[i+1][j]+P1[i-1][j])/dx/dx + (P1[i][j+1]+P1[i][j-1])/dy/dy + rho*((der1[i+1][j]-der1[i-1][j])/(2*dx) + (der2[i][j+1]-der2[i][j-1])/(2*dy)))/(2*(1/dx/dx + 1/dy/dy));
        }
    }
    return P1;
}

function gaussSeidelStep(V1, P1) {
    V0 = [...V1];
    console.log('kek');
    console.log(V0);
    for (let i = 0; i < 10; i++) {
        V1[0] = gaussSeidelLineU(V0, V1, P1);
        V1[1] = gaussSeidelLineV(V0, V1, P1);
        der1 = firstDer(V1);
        der2 = secondDer(V1);
        P1 = gaussSeidelLineP(P1, der1, der2);
    }
    console.log('Step!');
    console.log(V1);
}

function gaussSeidelDraw(V0, P1) {
    gaussSeidelStep(V0, P1);
    drawStep2D(ctxVField, V0);
    window.requestAnimationFrame(() => {gaussSeidelDraw(V0, P1)});
}


const gbA = [0, 0, 255];
const N = 20;                                 // max coordinate of Y-layers
const M = 20;                                 // max coordinate of X-layers
const T = 100;
const dt = 1/T;
const dx = 1/N;
const dy = 1/M;
const rho = 1;
const D = 0.01;
let der1 = [];
let der2 = [];
let V1 = [];
let V0;
let zeroRow;
let P = initialConditionsP();
V1 = initialConditionsV();
let vField, ctxVField;


addEventListener('load', () => {start()}, false);
console.log(V1);

// let a = [[1, 2, 3,],
//          [4, 5, 6,],
//          [7, 8, 9,],];
