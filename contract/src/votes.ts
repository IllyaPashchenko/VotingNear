import {
  NearBindgen,
  near,
  call,
  view,
  LookupMap,
  UnorderedSet,
  UnorderedMap,
} from "near-sdk-js";

@NearBindgen({})
class VotingContract {
  options = new UnorderedMap<string>("options");
  votes = new UnorderedMap<string[]>("votes");

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
    for (const v in Object.keys(this.votes)) {
      const values = this.votes.get(v, { defaultValue: []})
      if (values.includes(user)) return false;
    }
    return true;
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
  clearPools() {
    // options
    this.options.clear();
    this.options.set('1', 'Donald Trump');
    this.options.set('2', 'Barack Obama');
    this.options.set('3', 'Joe Biden');

    // votes
    this.votes.clear();
  }
}
