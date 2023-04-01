//set-up variables
let canvas = document.querySelector("canvas");
canvas.width = 900;
canvas.height = 600;
let c = canvas.getContext("2d");

let arrSize = document.getElementById("range").value;
let rectSize = 3;
let randMax = 200;
let speed = 25;

//useful functions -------------------------------------------------------
function generateArray() {      //n is the size of the array we want to generate (can be 300 max)
    let arr = new Array(arrSize);

    for (let i = 0; i < arrSize; ++i){
        arr[i] = Math.floor(Math.random()*randMax +1);
    }

    return arr;
}

function displayArray(arr, movingIndex, swapingWithIndex) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < arr.length; ++i){
        if (i == movingIndex){
            c.fillStyle = "red";
        }
        else if (i == swapingWithIndex){
            c.fillStyle = "blue";
        }
        else{
            c.fillStyle = "white";
        }
        c.fillRect(i*rectSize, canvas.height - arr[i]*rectSize, rectSize, arr[i]*rectSize);
    }
}

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getMax(x, y) {
    if (x > y){
        return x;
    }
    else{
        return y;
    }
}

function logArr(){
    console.log(arr);
}

//setting buttons -----------------------------------------------------
function init() {
    arr = generateArray();
    displayArray(arr, -1, -1);
    resetArr = arr.slice();
}

function resetFunc() {
    arr = resetArr.slice()
    displayArray(arr, -1, -1);
}

function changeArrSize() {
    arrSize = document.getElementById("range").value;
    init();
    let par = document.getElementById("rangeValue");
    par.innerHTML = arrSize;
}

//initial conditions ------------------------------------------------------------
let arr = generateArray();
let resetArr = arr.slice();
displayArray(arr, -1, -1);

//sorting functions ------------------------------------------------------------
async function bubbleSort() {
    let isSorted = false;
    while (!isSorted){
        isSorted = true;
        for (let i = 0; i < arr.length - 1; ++i){
            if (arr[i] > arr[i+1]){
                swap(arr, i, i+1);
                displayArray(arr, i+1, i);
                await sleep(speed);
                isSorted = false;
            }
        }
    }
    displayArray(arr, -1);
}

async function partition(low, high) {
    let i = low;
    let j = high;
    let pivot = arr[i];

    while (i < j){
        do{
            ++i;
        }while(arr[i] <= pivot && i < arr.length-1)

        do{
            --j;
        }while(arr[j] > pivot && j > 0)

        if (i < j){
            swap(arr, i, j);
            displayArray(arr, j, i);
            await sleep(speed);
        }
    }
    swap(arr, j, low);
    return j;
}

async function quickSort(l, h) {
    if (l < h){
        let j = await partition(l, h);
        await quickSort(l, j);
        await quickSort(j+1, h);
        displayArray(arr, -1, -1);
    }
}

async function heapify(parentIndex, n) {
    let max = parentIndex;
    let right = parentIndex*2 + 1;
    let left = parentIndex*2;

    if (left <= n && arr[left-1] > arr[max-1]){
        max = left;
    }
    if (right <= n && arr[right-1] > arr[max-1]){
        max = right;
    }
    if (max != parentIndex){
        swap(arr, max-1, parentIndex-1);
        displayArray(arr, parentIndex-1, max-1);
        await sleep(speed);
        await heapify(max, n);
    }
}

async function heapSort() {
    //turn array into max heap
    for (let i = Math.floor(arr.length/2); i >= 0; --i){
        await heapify(i, arr.length);
    }

    //sort array
    for (let i = arr.length-1; i >= 0; --i){
        swap(arr, 0, i);
        displayArray(arr, i, 0);
        await sleep(speed);
        await heapify(1, i-1);
    }
    displayArray(arr, -1, -1);
}

async function insertionSort() {
    for (let i = 1; i < arr.length; ++i){
        let j = i;
        for (j; j > 0; --j){
            if (arr[j] < arr[j-1]){
                swap(arr, j, j-1);
            }
            else{
                break;
            }
        }
        displayArray(arr, i+1, j);
        await sleep(speed);
    }
    displayArray(arr, -1, -1);
}

async function merge(lb, mid, ub) {
    let k = lb;
    let i = lb;
    let j = mid+1;
    let arrCpy = arr.slice();

    while (i <= mid && j <= ub){
        if (arrCpy[i] < arrCpy[j]){
            arr[k] = arrCpy[i];
            displayArray(arr, k, -1);
            await sleep(speed);
            ++i;
        }
        else{
            arr[k] = arrCpy[j];
            displayArray(arr, k, -1);
            await sleep(speed);
            ++j;
        }
        ++k;     
    }

    if (i > mid){
        for (j; j <= ub; ++j){
            arr[k] = arrCpy[j];
            displayArray(arr, k, -1);
            await sleep(speed);
            ++k;
        }
    }
    else{
        for (i; i <= mid; ++i){
            arr[k] = arrCpy[i];
            displayArray(arr, k, -1);
            await sleep(speed);
            ++k;
        }
    }
}

async function mergeSort(lb, ub) {
    if (lb < ub){
        let mid = Math.floor((lb+ub)/2);
        await mergeSort(lb, mid);
        await mergeSort(mid+1, ub);
        await merge(lb, mid, ub);
    }
    displayArray(arr, -1, -1);
}

async function selectionSort() {
    for (let i = 0; i < arr.length-1; ++i){
        let min = i;
        for (let j = i+1; j < arr.length; ++j){
            if (arr[j] < arr[min]){
                min = j;
            }
        }
        swap(arr, i, min);
        displayArray(arr, i, min);
        await sleep(speed);
    }
    displayArray(arr, -1, -1);
}

async function shellSort() {
    let gap = Math.floor(arr.length/2);   //gap sequence will be gap/2
    for (gap; gap > 0; gap = Math.floor(gap/2)){
        let i = 0;
        let j = gap;
        while (j < arr.length){
            if (arr[i] > arr[j]){
                swap(arr, i, j);
                displayArray(arr, i, j);
                await sleep(speed);
                let tempi = i;
                while (tempi - gap >= 0){
                    if (arr[tempi-gap] > arr[tempi]){
                        swap(arr, tempi-gap, tempi);
                        displayArray(arr, tempi-gap, tempi);
                        await sleep(speed);
                        tempi = tempi - gap;
                    }
                    else{
                        break;
                    }
                }
            }
            ++i;
            ++j;
        }
    }
    displayArray(arr, -1, -1);
}

//Sort Button Function
function Sort() {
    let val = document.getElementById("selectSort").value;
    switch (val) {
        case "1": bubbleSort(); break;
        case "2": quickSort(0, arr.length); break;
        case "3": heapSort(); break;
        case "4": insertionSort(); break;
        case "5": mergeSort(0, arr.length); break;
        case "6": selectionSort(); break;
        case "7": shellSort(); break;
        default: console.log("nope");
    }
}