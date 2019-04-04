<script>
   export default {
       name: "HtTree",
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
                               pdi:1,
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
               ]
           }
       },
       methods: {
           handleAddNode(nodeData, index, siblingNode) {
                let childData = nodeData.children,
                    childLength = childData.length,
                    title = nodeData.title;
                
                let newTitle = (siblingNode.length == 1? "child": title) + '-' + (childLength + 1);

                let newNode = {
                    title: newTitle,
                    expand: false,
                    children: []
                }
                childData.push(newNode)
           },
           handleDelNode(nodeData, index, siblingNode) {
               siblingNode.splice(index,1)
           },
           handleChecked(nodeData, index, siblingNode) {
                // nodeData.checked = !nodeData.checked
                console.log(nodeData)
                this.$emit('test')
           },
           setRelationNode(nodeData,checked) {

           },
           getCheckedNodeParents(nodeData) {

           }
       },
       render(h) {
        let createNode = (nodeData) => {
                return nodeData.map((current,index,siblingData) => {
                    const childData = current.children
                    return (
                        <li key={ current.id }>
                            <div class="node-content">
                                <div class="title"><input type="checkbox" value={ current.checked } checked={ current.checked } onChange={ this.handleChecked.bind(this, current, index, siblingData) } /> { current.title }</div>                            
                                <div class="operate">
                                    <span class="add-btn" onClick={ ()=>{ this.handleAddNode(current, index, siblingData) } }>+</span>
                                    <span class="del-btn" onClick={ ()=>{ this.handleDelNode(current, index, siblingData) } }>-</span>
                                </div>                            
                            </div>
                            <ul class="tree-child">{ childData.length > 0? createNode(childData):""}</ul>
                        </li>
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
    .tree-root,
    .tree-child{
        margin-top: 10px;
        li{
            margin-bottom: 10px;
            color: #666;
            font-size: 15px;
            .node-content{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .title{
                }
                .operate{
                    .add-btn,
                    .del-btn{
                        display: inline-block;
                        text-align: center;
                        width: 50px;
                        height: 25px;
                        line-height: 25px;
                        font-size: 18px;
                        color: #fff;
                        background-color: #57a3f3;
                        margin:0 5px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
    .tree-child{
        margin-bottom: 10px;
        li{
            margin-left: 20px;
        }
    }
}
</style>
