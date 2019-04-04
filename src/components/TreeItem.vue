<script>
export default {
    name: "TreeItem",
    props:{
        nodeItem: {
            type:Object,
            default:null
        },
        nodeKey: {
            type: Number
        },
        parentNode: {
            type:Object,
            default:null
        },
        checkedFn: {
            type: Function
        },
        deleteFn: {
            type: Function
        }
    },
    methods:{
        handleAddNode(nodeData, nodeKey) {
            let childData = nodeData.children,
                childLength = childData.length,
                title = nodeData.title,
                pid = this.nodeItem.pid;
                
            let newTitle = 'new node';

            let newNode = {
                pid:pid,
                title: newTitle,
                expand: false,
                children: []
            }
            childData.push(newNode)
        },
        handleDelNode(nodeData, nodeKey) {
            this.$emit('nodeDelete',nodeData,nodeKey,this.parentNode)
        },
        handleChecked(nodeData, nodeKey) {
            // console.log(nodeData,nodeKey,this.parentNode)
            this.$emit('nodeChecked',nodeData,nodeKey,this.parentNode)
        }
    },
    render() {
        const children = this.nodeItem.children

        return (
            <li key={ this.nodeItem.id }>
                <div class="node-content">
                    <div class="title"><input type="checkbox" value={ this.nodeItem.checked } checked={ this.nodeItem.checked } onChange={ this.handleChecked.bind(this, this.nodeItem, this.nodeKey) } /> { this.nodeItem.title }</div>                            
                    <div class="operate">
                        <span class="add-btn" onClick={ ()=>{ this.handleAddNode(this.nodeItem, this.nodeKey) } }>+</span>
                        <span class="del-btn" onClick={ ()=>{ this.handleDelNode(this.nodeItem, this.nodeKey) } }>-</span>
                    </div>                            
                </div>
                <ul class="tree-child">{ 
                    children.length > 0 ?
                    children.map((current,index) => (
                        <TreeItem  
                            parentNode={ this.nodeItem } 
                            nodeItem={ current } 
                            nodeKey={ index } 
                            onNodeChecked={ this.checkedFn } 
                            checkedFn={ this.checkedFn }  
                            onNodeDelete={ this.deleteFn } 
                            deleteFn={ this.deleteFn } 
                        />
                    ))
                    :'' 
                }</ul>
            </li>
        )
    },
    created() {
        // console.log(this.checkedFn)
    }
}
</script>
<style lang="scss" scoped>
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
</style>