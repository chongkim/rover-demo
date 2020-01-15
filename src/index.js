import './main.css';
import {
    CELL_WIDTH,
    CELL_HEIGHT,
    LEFT,
    RIGHT,
    DEG,
    MOVE,
    BORDER_THICKNESS,
} from './constants';

const output = document.getElementById('output');
const input = document.getElementById('input');
let jobs = [];

function enqueueJobs(content) {
    const lines = content.split('\n');
    input.innerText = content;
    let dim = lines.shift().split(' ');
    const width = parseInt(dim[0]) + 1; // the coords are 0-based, so we need to add 1
    const height = parseInt(dim[1]) + 1;
    makeGrid(width, height);
    while (0 < lines.length) {
        const initPosition = lines.shift().split(' ');
        const instructions = lines.shift().split('');
        const orientation = initPosition[2];
        jobs.push({
            width: width,
            height: height,
            x: parseInt(initPosition[0]),
            y: parseInt(initPosition[1]),
            orientation: orientation,
            instructions: instructions,
            deg: DEG[orientation],
            started: false,
        });
    }
    processJob();
}

function calcX(x, width) {
    return x * (CELL_WIDTH + BORDER_THICKNESS*2) + 10;
}

function calcY(y, height) {
    return (height - y - 1) * (CELL_HEIGHT + BORDER_THICKNESS*2) + 2;
}

function rotateRover(startDeg, endDeg) {
    let $rover = $('#rover');
    $({deg: startDeg}).animate({
        deg: endDeg,
    }, {
        duration: 500,
        step: (now) => {
            $rover.css({
                transform: `rotate(${now}deg)`,
            });
        },
        complete: processJob,
    })
}

function moveRover(job) {
    let $rover = $('#rover');
    $rover.animate({
        left: calcX(job.x, job.width),
        top: calcY(job.y, job.height),
    }, {
        duration: 500,
        complete: processJob,
    });
}

function setRover(job) {
    $('#rover').css({
        top: calcY(job.y, job.height),
        left: calcX(job.x, job.width),
        transform: `rotate(${job.deg}deg)`,
    }).show();
}

function processJob() {
    if (jobs.length === 0) {
        return;
    }
    let job = jobs[0];
    if (!job.started) {
        job.started = true;
        setRover(job);
        setTimeout(processJob, 0);
        return;
    }
    if (job.instructions.length === 0) {
        output.innerText += `${job.x} ${job.y} ${job.orientation}\n`;
        jobs.shift();
        setTimeout(processJob, 1000);
        return;
    }
    const instruction = job.instructions.shift();
    const origOrientation = job.orientation;
    switch(instruction) {
        case 'M':
            const move = MOVE[job.orientation];
            job.x += move.x;
            job.y += move.y;
            moveRover(job);
            break;
        case 'L':
            job.orientation = LEFT[job.orientation];
            rotateRover(job.deg, job.deg - 90);
            job.deg -= 90;
            break;
        case 'R':
            job.orientation = RIGHT[job.orientation];
            rotateRover(job.deg, job.deg + 90);
            job.deg += 90;
            break;
    }
}

function makeGrid(width, height) {
    let buf = '';
    for (let i = 0; i < width * height; i++) {
        buf += '<div class="cell"></div>';
        if (i % width === width - 1) {
            buf += '<div class="clear"></div>';
        }
    }
    buf += '<div id="rover">A</div>'
    document.getElementById('grid').innerHTML = buf;
}

function uploadFile(ev) {
    const file = document.getElementById('fileForUpload').files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (ev) => {
            enqueueJobs(ev.target.result);
        };
        reader.onerror = (ev) => {
            document.getElementById('output').innerHTML = 'error reading file';
        };
    }
}

$(() => {
    $('#fileForUpload').change(uploadFile);
    
    // To test without doing an upload, you can call directly with the content.
    // For example:
    // 
    // let content = "5 5\n" +
    //               "1 2 N\n" +
    //               "LMLMLMLMM\n" +
    //               "3 3 E\n" +
    //               "MMRMMRMRRM";
    // enqueueJobs(content);
});