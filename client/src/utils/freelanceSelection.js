class FreelanceSelection {
  constructor() {
    this.selection = 
      new Map(JSON.parse(localStorage.getItem('selection')));
  }

  isEmpty() {
    return this.selection.size === 0;
  }

  get(freelance) {
    if(freelance) {
      return this.selection.get(freelance['id']) || false;
    } else {
      return this.selection;
    }
  }

  add(freelance) {
    this.selection.set(freelance['id'], freelance);
    localStorage.setItem('selection', JSON.stringify([...this.selection]));
  }

  remove(freelance) {
    this.selection.delete(freelance['id']);
    localStorage.setItem('selection', JSON.stringify([...this.selection]));
  }

  removeAll() {
    this.selection.clear();
    localStorage.setItem('selection', JSON.stringify([...this.selection]));
  }
}

export default new FreelanceSelection();