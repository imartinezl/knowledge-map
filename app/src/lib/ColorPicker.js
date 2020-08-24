import '@simonwep/pickr/dist/themes/nano.min.css'; // 'classic' theme
import Pickr from '@simonwep/pickr';


export default class ColorPicker {

    constructor(el, defColor) {
        this.init(el, defColor);
        this.initEvents();
    }

    init(el, defColor) {
        this.pickr = Pickr.create({
            el: el,
            theme: 'nano', // 'classic' or 'monolith', or 'nano'
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(103, 58, 183, 1)',
                'rgba(63, 81, 181, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(3, 169, 244, 1)',
                'rgba(0, 188, 212, 1)',
                'rgba(0, 150, 136, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(139, 195, 74, 1)',
                'rgba(205, 220, 57, 1)',
                'rgba(255, 235, 59, 1)',
                'rgba(255, 193, 7, 1)'
            ],
            container: 'body',
            default: defColor,
            lockOpacity: true,
            useAsButton: false,
            components: {
                // Main components
                preview: true,
                opacity: true,
                hue: true,
                // Input / output Options
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    input: true,
                    clear: false,
                    save: false
                }
            }
        });
        this.pickr.setColor(defColor);
    }

    initEvents() {
        // this.pickr.on('change', (color, instance) => {
        //     console.log('change', color, instance);
        // })
    }

    getHEXAColor() {
        return this.pickr.getColor().toHEXA().toString();
    }
}