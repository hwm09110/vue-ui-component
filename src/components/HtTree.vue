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
                       title: "root node",
                       expand: true,
                       checked: false,
                       children: [
                           {
                               title: "child-1",
                               expand: false,
                               checked: false,
                               children: []
                           },
                           {
                               title: "child-2",
                               expand: false,
                               checked: false,
                               children: []
                           },
                           {
                               title: "child-3",
                               expand: false,
                               checked: false,
                               children: [
                                    {
                                        title: "child-3-1",
                                        expand: false,
                                        checked: false,
                                        children: []
                                    },
                                    {
                                        title: "child-3-2",
                                        expand: false,
                                        checked: false,
                                        children: []
                                    },
                                    {
                                        title: "child-3-3",
                                        expand: false,
                                        checked: false,
                                        children: []
                                    }
                               ]
                           },
                           {
                               title: "child-4",
                               expand: false,
                               checked: false,
                               children: []
                           }
                       ]
                   }
               ]
           }
       },
       methods: {
           handleAddNode(nodeData, index, parentData) {
                let childData = nodeData.children,
                    childLength = childData.length,
                    title = nodeData.title;
                
                let newTitle = (parentData.length == 1? "child": title) + '-' + (childLength + 1);

                let newNode = {
                    title: newTitle,
                    expand: false,
                    children: []
                }
                childData.push(newNode)
           },
           handleDelNode(nodeData, index, parentData) {
               parentData.splice(index,1)
           },
           handleChecked(e) {
               console.log(e)
           }
       },
       render(h) {
           let createNode = (nodeData) => {
                return nodeData.map((current,index,sourceData) => {
                    const childData = current.children
                    return (
                        <li>
                            <div class="node-content">
                                <div class="title"><input type="checkbox" checked={ current.checked } onChange={ this.handleChecked } /> { current.title }</div>                            
                                <div class="operate">
                                    <span class="add-btn" onClick={ ()=>{ this.handleAddNode(current, index, sourceData) } }>+</span>
                                    <span class="del-btn" onClick={ ()=>{ this.handleDelNode(current, index, sourceData) } }>-</span>
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
