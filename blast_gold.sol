// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;

interface IBlastPoints {
  function configurePointsOperator(address operator) external;
    function configurePointsOperatorOnBehalf(address contractAddress, address operator) external;
}

contract GuideDAO {
  constructor(address _pointsOperator) {
    IBlastPoints(0x2536FE9ab3F511540F2f9e2eC2A805005C3Dd800).configurePointsOperator(_pointsOperator);
  }
}
