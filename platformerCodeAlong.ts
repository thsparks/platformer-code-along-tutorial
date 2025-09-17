//% weight=100
//% color=#7F7A7A
// % icon="\uf544" - TODO icon
//% block="Platformer"
namespace platformer_code_along {
    /*********************************
     * BLOCKS
     *********************************/

    /**
     * Runs when the game begins
     */
    //% block="On Game Start"
    export function onGameStart(handler: () => void) {
        const stepNumber = tutorialcontrols.getTutorialStepNumber();

        // Run the user's code
        handler();

        if (stepNumber === 1) {
            validateTilemapWithAtLeastTwoTiles();
        }
    }

    /*********************************
     * VALIDATION
     *********************************/
    function validateTilemapWithAtLeastTwoTiles() {
        const tilemap = game.currentScene().tileMap;

        if (!tilemap) {
            tutorialcontrols.sendValidationResult(false, "Create a tilemap with at least two tiles to continue!");
            return;
        }

        let images = [];
        const tileThreshold = 2;
        for (let c = 0; c < tilemap.data.width; c++) {
            for (let r = 0; r < tilemap.data.height; r++) {
                const image = tilemap.getTile(c, r).getImage();
                if (images.indexOf(image) === -1) {
                    images.push(image);
                }

                if (images.length >= tileThreshold) {
                    break;
                }
            }

            if (images.length >= tileThreshold) {
                break;
            }
        }

        if (images.length < tileThreshold) {
            tutorialcontrols.sendValidationResult(false, "It looks like you only have one tile in your tilemap. Add a second one to continue!");
            return;
        }

        const defaultWidth = 16;
        const defaultHeight = 16;
        if (tilemap.data.width == defaultWidth && tilemap.data.height == defaultHeight) {
            tutorialcontrols.sendValidationResult(true, "Great! Double check before proceeding: do you want to resize your tilemap?");
            return;
        }

        tutorialcontrols.sendValidationResult(true, "Great job!");
    }
}