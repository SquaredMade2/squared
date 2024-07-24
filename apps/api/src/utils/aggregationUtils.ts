export const getLookup = (from: string, localField: string, foreignField: string, as: string) => ({
    $lookup: {
        from,
        localField,
        foreignField,
        as,
    },
});


export const tasksOfTeamFields = {
    $addFields: {
      'teams.tasks': {
        $map: {
          input: '$teams.tasks',
          as: 'task',
          in: {
            _id: '$$task._id',
            authorId: '$$task.authorId',
            title: '$$task.title',
            description: '$$task.description',
            status: '$$task.status',
            identifier: '$$task.identifier',
            priority: '$$task.priority',
            labels: '$$task.labels',
            dueDate: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: '$$task.dueDate' } },
            effortEstimate: '$$task.effortEstimate',
            team: '$$task.team',
            dateCreated: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: '$$task.dateCreated' } },
            assignee: '$$task.assignee',
          }
        }
      }
    }
  }

export const tasksOfTeamFieldsDirect =  {
    $addFields: {
      tasks: {
        $map: {
          input: '$tasks',
          as: 'task',
          in: {
            _id: '$$task._id',
            authorId: '$$task.authorId',
            title: '$$task.title',
            description: '$$task.description',
            status: '$$task.status',
            identifier: '$$task.identifier',
            priority: '$$task.priority',
            labels: '$$task.labels',
            dueDate: {
              $cond: {
                if: { $eq: ['$$task.dueDate', null] },
                else: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: '$$task.dueDate' } }
              }
            },
            effortEstimate: '$$task.effortEstimate',
            team: '$$task.team',
            dateCreated: {
              $cond: {
                if: { $eq: ['$$task.dateCreated', null] },
                else: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: '$$task.dateCreated' } }
              }
            },
            assignee: '$$task.assignee'
          }
        }
      }
    }
  }

export const workspaceGroup = {
    $group: {
        _id: '$_id',
        name: { $first: '$name' },
        url: { $first: '$url' },
        companySize: { $first: '$companySize' },
        universalTokenLink: { $first: '$universalTokenLink' },
        users: { $first: '$users' },
        projects: { $first: '$projects' },
        issuesCreated: { $first: '$issuesCreated' },
        __v: { $first: '$__v' },
        teams: {
            $push: {
                _id: '$teams._id',
                name: '$teams.name',
                identifier: '$teams.identifier',
                workspace: '$teams.workspace',
                users: '$teams.users',
                tasks: '$teams.tasks'
            }
        }
    }
}

  export const userOfWorkspaceField = {
    $addFields: {
        users: {
            $map: {
                input: '$users',
                as: 'userRole',
                in: {
                    _id: '$$userRole._id',
                    user: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: '$userDetails',
                                as: 'userDetail',
                                cond: { $eq: ['$$userDetail._id', '$$userRole.user'] }
                            }
                        },
                        0
                    ]
                    },
                    role: '$$userRole.role',
                    username: '$$userRole.username'
                }
            }
        }
    }
}