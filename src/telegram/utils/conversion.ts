import { ethers } from 'ethers';

export function unitConvert(weiValue: any): string {
  return ethers.formatUnits(weiValue, 'ether');
}
