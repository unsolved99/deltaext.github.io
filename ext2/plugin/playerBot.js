var worldPlayerBotNames = ['Unreal bot']
var worldPlayerBotSkins = []
var playerMaxCells = 16
var worldEatMult = 1.140175425099138
var playerSplitSizeDiv = 1.414213562373095
var playerSplitBoost = 780
var worldEatOverlapDiv = 3
var playerViewScaleMult = 1


class PlayerBot  {
    constructor(connection) {
        this.player = connection
        this.splitCooldownTicks = 0;
        this.target = null;
    }

    static get type() { return "playerbot"; }
    static get separateInTeams() { return true; }

    get shouldClose() {
        return !this.hasPlayer
            || !this.player.exists
            || !this.player.hasWorld;
    }
    update() {
        if (this.splitCooldownTicks > 0) this.splitCooldownTicks--;
        else this.target = null;

        //this.player.updateindexedCells();
        const player = this.player;


        /** @type {PlayerCell} */
        let cell = null;
        for (let i = 0, l = player.playerCells.length; i < l; i++)
            if (cell === null || player.playerCells[i].targetSize > cell.targetSize)
                cell = player.playerCells[i];
        if (cell === null) return;

        if (this.target != null) {
            if (!this.target.exists || !this.canEat(cell.targetSize, this.target.targetSize))
                this.target = null;
            else {
                this.mouseX = this.target.x;
                this.mouseY = this.target.y;
                return;
            }
        }

        const atMaxCells = player.playerCells.length >= playerMaxCells;
        const willingToSplit = player.playerCells.length <= 2;
        const cellCount = Object.keys(player.indexedCells).length;

        let mouseX = 0;
        let mouseY = 0;
        let bestPrey = null;
        let splitkillObstacleNearby = false;

        for (let id in player.indexedCells) {
            const check = player.indexedCells[id];
            const truncatedInfluence = Math.log10(cell.targetSize*cell.targetSize);
            let dx = check.targetX - cell.targetX;
            let dy = check.targetY - cell.targetY;
            let dSplit = Math.max(1, Math.sqrt(dx * dx + dy * dy));
            let d = Math.max(1, dSplit - cell.targetSize - check.targetSize);
            let influence = 0;
            switch (check.type) {
                case 'cell':
                    if (check.isPlayerCell) break;
                    //if (player.team !== null && player.team === check.owner.team) break;
                    if (this.canEat(cell.targetSize, check.targetSize)) {
                        influence = truncatedInfluence;
                        if (!this.canSplitkill(cell.targetSize, check.targetSize, dSplit)) break;
                        if (bestPrey === null || check.targetSize > bestPrey.targetSize)
                            bestPrey = check;
                    } else {
                        influence = this.canEat(check.targetSize, cell.targetSize) ? -truncatedInfluence * cellCount : -1;
                        splitkillObstacleNearby = true;
                    }
                    break;
                case 'food': influence = 1; break;
                case 'virus':
                    if (atMaxCells) influence = truncatedInfluence;
                    else if (this.canEat(cell.targetSize, check.targetSize)) {
                        influence = -1 * cellCount;
                        if (this.canSplitkill(cell.targetSize, check.targetSize, dSplit))
                            splitkillObstacleNearby = true;
                    }
                    break;
                //case 'ejected': if (this.canEat(cell.targetSize, check.targetSize)) influence = truncatedInfluence * cellCount; break;
                /*case 'mothercell':
                    if (this.canEat(check.targetSize, cell.targetSize)) influence = -1;
                    else if (this.canEat(cell.targetSize, check.targetSize)) {
                        if (atMaxCells) influence = truncatedInfluence * cellCount;
                        else influence = -1;
                    }
                    break;*/
            }

            if (influence === 0) continue;
            if (d === 0) d = 1;
            dx /= d; dy /= d;
            mouseX += dx * influence / d;
            mouseY += dy * influence / d;
        }

        if (
                willingToSplit && !splitkillObstacleNearby && this.splitCooldownTicks <= 0 &&
                bestPrey !== null && bestPrey.targetSize * 2 > cell.targetSize
            ) {
            this.target = bestPrey;
            player.cursorX = player.targetX = bestPrey.x;
            player.cursorY = player.targetY = bestPrey.y;
            this.splitAttempts++;
            this.splitCooldownTicks = 25;
        } else {
            const s = Math.pow(Math.min(64 / player.playerSize, 1), 0.4);
            const viewAreaw = 1920 / s / 2 * 1.985;
            const viewAreah = 1080 / s / 2 * 1.985;

            const d = Math.max(1, Math.sqrt(mouseX * mouseX + mouseY * mouseY));
            player.cursorX = player.targetX = cell.x + mouseX / d * viewAreaw;
            player.cursorY = player.targetY = cell.y + mouseY / d * viewAreah;
        }
    }

    /**
     * @param {number} aSize
     * @param {number} bSize
     */
    canEat(aSize, bSize) {
        return aSize > bSize * worldEatMult;
    }
    /**
     * @param {number} aSize
     * @param {number} bSize
     * @param {number} d
     */
    canSplitkill(aSize, bSize, d) {
        const splitDistance = Math.max(
            2 * aSize / playerSplitSizeDiv / 2,
            playerSplitBoost
        );
        return aSize / playerSplitSizeDiv > bSize * worldEatMult &&
               d - splitDistance <= aSize - bSize / worldEatOverlapDiv;
    }
}
