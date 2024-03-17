export class Powerup {
    constructor(id, name, description, cost) {
        this.powerup_id = id;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.effects = [];
    }

    toJSON() {
        return {
            powerup_id: this.powerup_id,
            name: this.name,
            description: this.description,
            cost: this.cost,
            effects: this.effects,
        };
    }
}
