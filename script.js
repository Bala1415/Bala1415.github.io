var images = [
    { src: 'img/puz.jpeg', title: 'Image 1' },
];

$(function () {
    var gridSize = $('#levelPanel :radio:checked').val();
    imagePuzzle.startGame(images, gridSize);
    $('#newPhoto').click(function () {
        var gridSize = $('#levelPanel :radio:checked').val();
        imagePuzzle.startGame(images, gridSize);
    });

    $('#levelPanel :radio').change(function (e) {
        var gridSize = $(this).val();
        imagePuzzle.startGame(images, gridSize);
    });
});

function rules() {
    alert('Rearrange the pieces so that you get a sample image. \nThe steps taken are counted');
}

function downloadImage() {
    var link = document.createElement('a');
    link.href = 'img/eventimage.png';
    link.download = 'eventimage.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}