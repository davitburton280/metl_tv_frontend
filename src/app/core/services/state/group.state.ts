import {BaseState} from '@core/services/state/base.state';
import {GroupInitialStateInterface, GroupItemInterface} from '@core/interfaces/group.interface';


export const groupsInitialState: GroupInitialStateInterface = {
    groups: [],
    loading: false
};

export class GroupState extends BaseState<GroupInitialStateInterface> {
    constructor(initialInputData: any = groupsInitialState) {
        super(initialInputData);
    }


    addNods(groups: any): void {
        this.setState({
            ...this.state,
            groups: [
                ...this.state.groups,
                Object.assign(groups)
            ]
        });
    }

    setGroups(groups: any): void {
        this.setState({
            ...this.state,
            groups: [
                ...groups,
            ]
        });
    }

    updateGroup(groupId: any, data: any): void {
        const groups = this.state.groups.map((i: any) => {
            if (i.id === groupId) {
                // i.start_at = data.start_at;
                // i.end_at = data.end_at;
                // i.from = data.from;
                // i.unit = data.unit;
                // i.to = data.to;
            }
            return {...i};
        });
        this.setState({
            ...this.state,
            groups: [
                ...groups
            ]
        });
    }

    deleteNods(groupId: number): void {
        const groups = this.state.groups.filter((i: any) => i.id !== groupId);
        this.setState({
            ...this.state,
            groups: [
                ...groups
            ]
        });
    }


    setLoading(loading: boolean): void {
        this.setState({
            ...this.state,
            loading
        });
    }


}

