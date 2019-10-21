<script>
    import TreeItem from '@c/TreeItem'
    export default {
        name: "Tree",
        props:{
            id:{
            type:Number,
            default:1
            }
        },
        data() {
            return {
                treeData:[
                    {
                        id:1,
                        pid:null,
                        title: "root node",
                        expand: true,
                        checked: false,
                        children: [
                            {
                                id:2,
                                pid:1,
                                title: "child-1",
                                expand: false,
                                checked: false,
                                children: []
                            },
                            {
                                id:3,
                                pid:1,
                                title: "child-2",
                                expand: false,
                                checked: false,
                                children: []
                            },
                            {
                                id:4,
                                pid:1,
                                title: "child-3",
                                expand: false,
                                checked: false,
                                children: [
                                    {
                                        id:5,
                                        pid:4,
                                        title: "child-3-1",
                                        expand: false,
                                        checked: false,
                                        children: []
                                    },
                                    {
                                        id:6,
                                        pid:4,
                                        title: "child-3-2",
                                        expand: false,
                                        checked: false,
                                        children: []
                                    },
                                    {
                                        id:7,
                                        pid:4,
                                        title: "child-3-3",
                                        expand: false,
                                        checked: false,
                                        children: []
                                    }
                                ]
                            },
                            {
                                id:8,
                                pid:1,
                                title: "child-4",
                                expand: false,
                                checked: true,
                                children: []
                            }
                        ]
                    }
                ],
                sourceTreeData:[
                    {
                        id:1,
                        pid:null,
                        title: "root node",
                        expand: true,
                        checked: false,
                        children: []
                    },
                    {
                        id:2,
                        pid:1,
                        title: "child-1",
                        expand: false,
                        checked: false,
                        children: []
                    },
                    {
                        id:3,
                        pid:1,
                        title: "child-2",
                        expand: false,
                        checked: false,
                        children: []
                    },
                    {
                        id:8,
                        pid:1,
                        title: "child-4",
                        expand: false,
                        checked: true,
                        children: []
                    },
                    {
                        id:4,
                        pid:1,
                        title: "child-3",
                        expand: false,
                        checked: false,
                        children: []
                    },
                    {
                        id:5,
                        pid:4,
                        title: "child-3-1",
                        expand: false,
                        checked: false,
                        children: []
                    },
                    {
                        id:6,
                        pid:4,
                        title: "child-3-2",
                        expand: false,
                        checked: false,
                        children: []
                    },
                    {
                        id:7,
                        pid:4,
                        title: "child-3-3",
                        expand: false,
                        checked: false,
                        children: []
                    }
                ]
            }
        },
        methods: {
            setRelationNode(nodeData,checked) {

            },
            getCheckedNodeParents(nodeData) {
                let pid = nodeData.pid
                let parentNodes = [];
                console.log(this.getParentNodeById(pid))
            },
            getParentNodeById(pid){
                let result = [];
                this.treeData.forEach((item) => {
                    if(item.id == pid){
                        result.push(item)
                        item.pid && this.getParentNodeById(item.pid)
                    }
                })
                return result
            },
            getRootNode(data) {
                let rootNodes = []
                data.forEach((item,index) => {
                    if(!item.pid){
                        rootNodes.push(item)
                    }
                })
                return rootNodes
            },
            convertTreeData(data) {

            },
            _initTreeData() {
                
            },
            handleNodeChecked(currentNode, nodeKey, parentNode) {
                console.log('node-checked', currentNode, nodeKey, parentNode)
                this.getCheckedNodeParents(currentNode)
            },
            handleNodeDelete(currentNode, nodeKey, parentNode){
                console.log('node-delete',currentNode, nodeKey, parentNode)
                if(!currentNode.pid){
                    this.treeData.splice(nodeKey,1)
                }else{
                    parentNode.children.splice(nodeKey,1)
                }
            }
        },
        render(h) {
            let createNode = (nodeData) => {
                    return nodeData.map((current,index) => {
                        return (
                            <TreeItem 
                                nodeItem={ current } 
                                parentNode={ current } 
                                nodeKey={ index } 
                                onNodeChecked={ this.handleNodeChecked } 
                                checkedFn={ this.handleNodeChecked } 
                                onNodeDelete={ this.handleNodeDelete } 
                                deleteFn={ this.handleNodeDelete } 
                            />
                        )
                    })
                }

            return (
                <div class="tree-wrap">
                    <ul class="tree-root">
                        { createNode(this.treeData) }
                    </ul>
                </div>
            )
        },
        created() {
            console.log(this.id)
        }
    }
</script>

<style lang="scss" scoped>
.tree-wrap{
    // width: 600px;
    padding: 20px;
}
</style>
