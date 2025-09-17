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
            validateTilemapWithAtLeastTwoTiles(); // Create tilemap, sky & ground
        } else if (stepNumber === 2) {
            validateTilemapWithAtLeastThreeTiles(); // Add hazard tile
        } else if (stepNumber === 3) {
            validateWallsInTilemap(); // Add walls
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

        const tileThreshold = 2;
        const uniqueTiles = getUniqueTileImageCount(tilemap);
        if (uniqueTiles < tileThreshold) {
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

    function validateTilemapWithAtLeastThreeTiles() {
        const tilemap = game.currentScene().tileMap;
        const tileThreshold = 3;
        const uniqueTiles = getUniqueTileImageCount(tilemap);
        if (uniqueTiles < tileThreshold) {
            tutorialcontrols.sendValidationResult(false, "Add a new hazard tile to continue!");
            return;
        }
    }

    function validateWallsInTilemap() {
        const tilemap = game.currentScene().tileMap;

        for (let c = 0; c < tilemap.data.width; c++) {
            for (let r = 0; r < tilemap.data.height; r++) {
                if (tilemap.data.isWall(c, r)) {
                    tutorialcontrols.sendValidationResult(true, "Nice work!");
                }
            }
        }
        tutorialcontrols.sendValidationResult(false, "Add walls in your tilemap to continue!");
    }

    /*********************************
    * UTIL
    *********************************/
    function getUniqueTileImageCount(tilemap: tiles.TileMap): number {
        let images = [];
        for (let c = 0; c < tilemap.data.width; c++) {
            for (let r = 0; r < tilemap.data.height; r++) {
                const image = tilemap.getTile(c, r).getImage();
                if (images.indexOf(image) === -1) {
                    images.push(image);
                }
            }
        }

        return images.length;
    }
}