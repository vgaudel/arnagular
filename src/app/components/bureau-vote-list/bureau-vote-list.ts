import { Component } from '@angular/core';
import { BureauVote } from '../bureau-vote/bureau-vote';

@Component({
  imports: [BureauVote],
  selector: 'app-bureau-vote-list',
  styleUrl: './bureau-vote-list.scss',
  templateUrl: './bureau-vote-list.html',
})
export class BureauVoteList {

  pour : number = 0;
  contre : number = 0;
  abstention : number = 0;

  onVoteRecu(choix: string):void {
    if(choix==='pour') {this.pour++;}
    else if (choix ==='contre') {this.contre++;}
    else {this.abstention++;}
  }
}
 