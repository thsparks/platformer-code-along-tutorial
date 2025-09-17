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

        let valid = true;
        switch (stepNumber) {
            case 1:
                // Create tilemap, sky & ground
                valid = validateTilemapExists();
                if (!valid) break;
                valid = validateTilemapTileCount(2, "It looks like you only have one tile in your tilemap. Add a second one to continue!");
                if (!valid) break;
                valid = validateTilemapResized();

                break;
            case 2:
                // Add hazard tile
                valid = validateTilemapTileCount(3, "Add a new hazard tile to continue!");
                break;
            case 3:
                // Add walls
                valid = validateWallsInTilemap();
                break;
            case 4:
                // Add goal
                valid = validateTilemapTileCount(4, "Add a new goal tile to continue!");
            default:
                // No validation
        }

        if (valid) {
            tutorialcontrols.sendValidationResult(true, "Nice work!");
        }
    }

    /*********************************
    * VALIDATION
    *********************************/
    function validateTilemapExists(): boolean {
        const tilemap = game.currentScene().tileMap;

        if (!tilemap) {
            tutorialcontrols.sendValidationResult(false, "Create a tilemap with at least two tiles to continue!");
            return false;
        }

        return true;
    }

    function validateTilemapTileCount(tileThreshold: number, errMsg: string): boolean {
        const tilemap = game.currentScene().tileMap;
        const uniqueTiles = getUniqueTileImageCount(tilemap);

        if (uniqueTiles < tileThreshold) {
            tutorialcontrols.sendValidationResult(false, errMsg);
            return false;
        }
        return true;
    }

    function validateTilemapResized(): boolean {
        const tilemap = game.currentScene().tileMap;
        const defaultWidth = 16;
        const defaultHeight = 16;
        if (tilemap.data.width == defaultWidth && tilemap.data.height == defaultHeight) {
            tutorialcontrols.sendValidationResult(true, "Great! Double check before proceeding: do you want to resize your tilemap?");
            return false;
        }

        return true;
    }

    function validateWallsInTilemap(): boolean {
        const tilemap = game.currentScene().tileMap;

        for (let c = 0; c < tilemap.data.width; c++) {
            for (let r = 0; r < tilemap.data.height; r++) {
                if (tilemap.data.isWall(c, r)) {
                    tutorialcontrols.sendValidationResult(true, "Nice work!");
                    return true;
                }
            }
        }
        tutorialcontrols.sendValidationResult(false, "Add walls in your tilemap to continue!");
        return false;
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