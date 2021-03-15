var sorter
var canvas
var ctx
var img
var image_data
var mode

(async function () {
    sorter = await PixelSort.init('./dist/optimized.wasm');
}).call(this)

jQuery(document).ready(() => {

    //loader hide
    canvas = document.getElementById('ps_canvas')
    ctx = canvas.getContext('2d')

    jQuery('#ps_input').on('change', (e) => {
        e.preventDefault()
        getImageData(e.target.files[0])
            .then(() => {
                displayPreview(canvas)
            })
    })

    jQuery('#modes').on('change', (e) => {
        changeOptions(e.target.value)
    })

    jQuery('#download_sorted').on('click', () => {
        download(canvas, 'sorted.png');
    })

    jQuery('input[type=range]').on('change', () => {
        let f = `rgba(${jQuery('#color_fromA').val()}, ${jQuery('#color_fromB').val()}, ${jQuery('#color_fromC').val()}, 1)`
        let t = `rgba(${jQuery('#color_toA').val()}, ${jQuery('#color_toB').val()}, ${jQuery('#color_toC').val()}, 1)`
        jQuery('.ps_holder').css('cssText', `background: linear-gradient(90deg, ${f}, ${t});`)
        console.log(f, t)
    })

    jQuery('#sort_btn').on('click', () => {

        if (img && image_data) {
            getImageData(jQuery('#ps_input')[0].files[0])
                .then(() => {
                    sorter.sort(image_data, img.height, createOptions())
                    ctx.putImageData(image_data, 0, 0);
                    displayPreview(canvas)
                    console.log("Sorting ended!")
                })
        }
    })
})

function getImageData(file) {
    return new Promise((res, rej) => {
        img = new Image()
        img.onload = () => {
            canvas.height = img.height
            canvas.width = img.width
            ctx.drawImage(img, 0, 0)
            image_data = ctx.getImageData(0, 0, img.width, img.height)
            res()
        }
        img.onerror = (error) => {
            rej(error)
        }
        img.src = URL.createObjectURL(jQuery('#ps_input')[0].files[0]);
    })
}

function displayPreview(canvas) {
    jQuery('#ps_preview').attr("src", canvas.toDataURL("image/png;base64"))
    jQuery('#ps_preview').show('fast')
}

function download(canvas, filename) {
    var lnk = document.createElement('a'), e;
    lnk.download = filename;
    lnk.href = canvas.toDataURL("image/png;base64");
    if (document.createEvent) {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false,
            false, 0, null);

        lnk.dispatchEvent(e);
    } else if (lnk.fireEvent) {
        lnk.fireEvent("onclick");
    }
}

function createOptions() {
    let options = new sorter.wasm.exports.SortOptions(jQuery('#modes').val())
    options.fromA = Math.min(jQuery('#color_fromA').val(), jQuery('#color_toA').val())
    options.toA = Math.max(jQuery('#color_fromA').val(), jQuery('#color_toA').val())
    options.fromB = Math.min(jQuery('#color_fromB').val(), jQuery('#color_toB').val())
    options.toB = Math.max(jQuery('#color_fromB').val(), jQuery('#color_toB').val())
    options.fromC = Math.min(jQuery('#color_fromC').val(), jQuery('#color_toC').val())
    options.toC = Math.max(jQuery('#color_fromC').val(), jQuery('#color_toC').val())
    options.sortBy = jQuery('#sort_by').val()

    /*
    options.A = 0
    options.B = 0
    options.C = 0
    */

    return options
}

function changeOptions(val) {
    switch (val) {
        case '1':
            jQuery('.hue').hide()
            jQuery('.rgb').show()
            jQuery('#sort_by').val(1)
            jQuery('#A').text('R')
            jQuery('#B').text('B')
            jQuery('#C').text('G')
            jQuery('#color_fromA').attr('max', 255)
            jQuery('#color_toA').attr('max', 255)
            jQuery('#color_fromB').attr('max', 255)
            jQuery('#color_toB').attr('max', 255)
            jQuery('#color_fromC').attr('max', 255)
            jQuery('#color_toC').attr('max', 255)
            jQuery('#color_fromA').attr('value', 0)
            jQuery('#color_toA').attr('value', 255)
            jQuery('#color_fromB').attr('value', 0)
            jQuery('#color_toB').attr('value', 255)
            jQuery('#color_fromC').attr('value', 0)
            jQuery('#color_toC').attr('value', 255)
            jQuery('#color_fromA').val(0)
            jQuery('#color_toA').val(255)
            jQuery('#color_fromB').val(0)
            jQuery('#color_toB').val(255)
            jQuery('#color_fromC').val(0)
            jQuery('#color_toC').val(255)
            break
        case '2':
            jQuery('.rgb').hide()
            jQuery('.hue').show()
            jQuery('#sort_by').val(5)
            jQuery('#A').text('H')
            jQuery('#B').text('S')
            jQuery('#C').text('V')
            jQuery('#color_fromA').attr('max', 360)
            jQuery('#color_toA').attr('max', 360)
            jQuery('#color_fromB').attr('max', 100)
            jQuery('#color_toB').attr('max', 100)
            jQuery('#color_fromC').attr('max', 100)
            jQuery('#color_toC').attr('max', 100)
            jQuery('#color_fromA').attr('value', 0)
            jQuery('#color_toA').attr('value', 360)
            jQuery('#color_fromB').attr('value', 0)
            jQuery('#color_toB').attr('value', 100)
            jQuery('#color_fromC').attr('value', 0)
            jQuery('#color_toC').attr('value', 100)
            jQuery('#color_fromA').val(0)
            jQuery('#color_toA').val(360)
            jQuery('#color_fromB').val(0)
            jQuery('#color_toB').val(100)
            jQuery('#color_fromC').val(0)
            jQuery('#color_toC').val(100)
            break
    }
}