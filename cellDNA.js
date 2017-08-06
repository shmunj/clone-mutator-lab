class DNA {
  constructor(genes) {
    this.genes = genes || function() {
      var genes = {};
      genes.size = random(5, 25);
      genes.r = random(256);  // check for < 0 || > 255 after mutaiton
      genes.g = random(256);
      genes.b = random(256);
      genes.ageRate = random(0.01, 0.5);
      genes.spawnChance = random(0.001, 0.002);
      genes.speed = random(0.01, 5);
      return genes;
    }();
  }
  
  clone() {
    var newGenes = Object.assign({}, this.genes);
    return new DNA(newGenes);
  }
  
  mutate(gene) {
    var gene = gene || random(Object.keys(this.genes));
    var mod = this.genes[gene] * 0.1;
    this.genes[gene] += random([-mod, mod]);
  }
}

class Cell {
  constructor(pos, dna) {
    this.pos = pos || createVector(random(width), random(height));
    if (dna) {
      this.dna = dna.clone();
    } else {
      this.dna = new DNA()
    }
    this.gen = this.dna.genes;
    this.hp = 100;
    this.a = 255;
  }
  
  update() {
    this.pos.add(createVector(
      random(-this.gen.speed, this.gen.speed),
      random(-this.gen.speed, this.gen.speed)
    ));
    
    this.hp -= this.gen.ageRate;
    this.a = map(this.hp, 0, 100, 20, 255)
  
    if (random(0, 1) <= this.gen.spawnChance) {
      if (cells.length < maxCells) {
        this.spawn();
      }
    }
  }
  
  isDead() {
    return (this.hp <= 0 ||
            this.pos.x < 0 || this.pos.x > width ||
            this.pos.y < 0 || this.pos.y > height);
  }
  
  spawn() {
    var newPos = createVector(
      this.pos.x + random(-2 * this.gen.size, 2 * this.gen.size),
      this.pos.y + random(-2 * this.gen.size, 2 * this.gen.size)
    );
    
    cells.push(new Cell(newPos, this.dna));
  }
  
  show() {
    push();
      noStroke();
      fill(this.gen.r, this.gen.g, this.gen.b, this.a);
      ellipse(this.pos.x, this.pos.y, this.gen.size);
    pop();
  }
}
