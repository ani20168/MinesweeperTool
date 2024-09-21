// worker.js

self.onmessage = function(event) {
    const { variables, constraints } = event.data;
    const totalAssignments = Math.pow(2, variables.length);
    let validAssignments = 0;
    const mineCounts = {};
    variables.forEach(v => mineCounts[v] = 0);
  
    // 使用递归枚举，并添加剪枝
    function enumerateAssignments(assignment = {}, index = 0) {
      if (index === variables.length) {
        if (isValidAssignment(assignment)) {
          validAssignments++;
          variables.forEach(v => {
            if (assignment[v] === 1) {
              mineCounts[v]++;
            }
          });
        }
        return;
      }
  
      const variable = variables[index];
  
      // 尝试赋值为0
      assignment[variable] = 0;
      if (isPartialValidAssignment(assignment)) {
        enumerateAssignments(assignment, index + 1);
      }
  
      // 尝试赋值为1
      assignment[variable] = 1;
      if (isPartialValidAssignment(assignment)) {
        enumerateAssignments(assignment, index + 1);
      }
  
      // 回溯
      delete assignment[variable];
    }
  
    function isPartialValidAssignment(assignment) {
      for (const constraint of constraints) {
        let sum = 0;
        let unassigned = 0;
        for (const cell of constraint.cells) {
          if (assignment.hasOwnProperty(cell)) {
            sum += assignment[cell];
          } else {
            unassigned++;
          }
        }
        if (sum > constraint.total) {
          return false;
        }
        if (sum + unassigned < constraint.total) {
          return false;
        }
      }
      return true;
    }
  
    function isValidAssignment(assignment) {
      for (const constraint of constraints) {
        let sum = 0;
        for (const cell of constraint.cells) {
          sum += assignment[cell] || 0;
        }
        if (sum !== constraint.total) {
          return false;
        }
      }
      return true;
    }
  
    enumerateAssignments();
  
    self.postMessage({ validAssignments, mineCounts });
  };
  