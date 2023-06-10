import {
  NearBindgen,
  near,
  call,
  view,
  LookupMap,
  UnorderedSet,
  UnorderedMap,
  initialize,
} from "near-sdk-js";

@NearBindgen({})
class VotingContract {
  options = new UnorderedMap<string>("options");
  votes = new UnorderedMap<string[]>("votes");
  voters = new UnorderedSet<string>("voters");
  admins = new UnorderedSet<string>("admins")

  @view({})
  getOptions(): [string, string][] {
    return this.options.toArray();
  }

  /** [['1', ['user1', 'user2']], ['2', ['user3', 'user4']]] */
  @view({})
  getVotes(): [string, string[]][] {
    return this.votes.toArray();
  }


  @view({})
  votesAvailable({ user }: { user: string }): boolean {
    if (!this.voters.contains(user)) return false;
    for (const row of this.votes.toArray()) {
      if (row[1].includes(user)) return false;
    }
    return true;
  }

  @view({})
  isUserAdmin({user}: {user: string}): boolean {
    return (this.admins.contains(user)) ? true : false;
  }

  @call({})
  addVote({ vote, user }: { vote: string, user: string }) {
    if (this.votesAvailable({ user })) {
      const values = this.votes.get(vote, { defaultValue: []})
      values.push(user)
      this.votes.set(vote, values)
    }
  }

  @call({})
  addOption({option, user}: {option: string, user: string}) {
    if(!this.admins.contains(user)) return;
    
    let new_index = Math.max(...this.options.toArray().map(i => Number(i[0]))) + 1;
    this.options.set(new_index.toString(), option);
  }

  @call({})
  deleteOption({optionId, user}: {optionId:string, user: string}) {
    if(!this.admins.contains(user)) return;
    
    this.options.remove(optionId);
  }

  @call({})
  clearPools({user}: {user: string}) {
    if(!this.admins.contains(user)) return;
    // options
    this.options.clear();
    // votes
    this.votes.clear();
  }

  @call({})
  initialize() {
    this.options.set('1', 'Антон Треущенко');
    this.options.set('2', 'Сурен Мартікян');
    this.options.set('3', 'Ілля Пащенко');
    this.options.set('4', 'Who else');

    this.voters.set("taras-shevchenko.testnet");
    this.voters.set("illya-pashchenko.testnet");
    this.voters.set("andriy-malyshko.testnet");
    this.voters.set("grygoriy-skovoroda.testnet");
    this.voters.set("ivan-franko.testnet");
    this.voters.set("lesya-ukrainka.testnet");
    this.voters.set("lina-kostenko.testnet");
    this.voters.set("taras-shevchenko.testnet");

    this.admins.set("illya-pashchenko.testnet")
  }
}
