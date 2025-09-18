// TODO Items
// - Consider moving all validation into an onGameUpdate loop, providing some kind of callback.
//      - That way, if they have the code but do it somewhere outside of on start, it still works.
//      - For example, start gravity on A button press (or add a title screen)

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
        let stepHasValidation = true;
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
            case 5:
                // Player sprite
                valid = validatePlayerExists();
            case 6:
                // Starting position
                stepHasValidation = false;
            case 7:
                // Move left and right
                valid = validateMoveLeftAndRight();
            case 8:
                // Gravity
                valid = validateGravity();
            case 9:
                // Jumping
            case 10:
                // Game over lose
            case 11:
                // Game over win
            case 12:
                // Test
            default:
                // No validation
                stepHasValidation = false;
        }

        if (valid && stepHasValidation) {
            tutorialcontrols.sendValidationResult(true, "Nice work!");
        }
    }

    /*********************************
    * VALIDATION
    * These functions trigger a failure result message if validation fails.
    * Then return false if failed, true otherwise.
    * They do NOT send the generic success message. That is left for the parent.
    *********************************/
    function validateGravity(): boolean {
        if (!validatePlayerExists()) {
            return false;
        }

        let playerSprite = sprites.allOfKind(SpriteKind.Player)[0];
        if (playerSprite.ay === 0) {
            tutorialcontrols.sendValidationResult(false, "Set your player sprite's Y acceleration to continue.");
            return false;
        } else if (playerSprite.ay < 0) {
            // Allow upside down gravity but give a warning
            tutorialcontrols.sendValidationResult(true, "Oh my! Your gravity is reversed. Make sure that's what you want before you continue!");
            return false;
        } else {
            return true;
        }
    }

    function validateMoveLeftAndRight(): boolean {
        if (!validatePlayerExists()) {
            return false;
        }

        // Start with a validation failure, which will be overwritten when the player moves are detected
        tutorialcontrols.sendValidationResult(false, "Move your player left and right to continue!");

        let playerSprite = sprites.allOfKind(SpriteKind.Player)[0];
        let lastKnownX = playerSprite.x;
        let hasMovedLeft: boolean;
        let hasMovedRight: boolean;
        game.onUpdate(() => {
            if (!hasMovedRight && playerSprite.x > lastKnownX) {
                hasMovedRight = true;
                if (hasMovedLeft) {
                    tutorialcontrols.sendValidationResult(true, "Nice work!");
                } else {
                    tutorialcontrols.sendValidationResult(false, "Move your player left to continue!");
                }
            }
            if (!hasMovedLeft && playerSprite.x < lastKnownX) {
                hasMovedLeft = true;
                if (hasMovedRight) {
                    tutorialcontrols.sendValidationResult(true, "Nice work!");
                } else {
                    tutorialcontrols.sendValidationResult(false, "Move your player right to continue!");
                }
            }
            lastKnownX = playerSprite.x;
        })

        return false;
    }

    function validatePlayerExists(): boolean {
        const playerSprites = sprites.allOfKind(SpriteKind.Player);
        if (playerSprites.length <= 0) {
            tutorialcontrols.sendValidationResult(false, "Create a sprite of kind Player to continue!")
            return false;
        }
        return true;
    }

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