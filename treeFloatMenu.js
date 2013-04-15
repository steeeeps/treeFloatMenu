define(['dojo', 'dijit/Tree'], function(dojo, Tree){
    dojo.extend(Tree, {
        //传入对象或数组，eg:{node:'<span class="dijitTree-float-menu-mod" title="修改节点"></span>',onClick:function(event){...}}
        floatMenu: function(args){
            this._floatNode = null;
            this._floatItems = [];
            if (!dojo.isArray(args)) {
                args = [args];
            }
            //创建浮动菜单
            this._floatMenu = dojo.create('span', {
                'class': "dijitTree-float-menu"
            });
            var frag = document.createDocumentFragment();
            for (var i = 0; i < args.length; i++) {
                var a = args[i];
                var node = a.node;
                //如果传入为html片段
                if (dojo.isString(node)) {
                    node = dojo.toDom(node);
                }
				dojo.addClass(node,'dijitTree-float-menu-item');
                node.setAttribute('idx', i);
                node._onClick = a.onClick;
                node._onTreeNodeMouseOver = a.onTreeNodeMouseOver;
                frag.appendChild(node);
                
                this._floatItems.push(node);
            }
            //将按钮加入菜单
            this._floatMenu.appendChild(frag);
            this.domNode.appendChild(this._floatMenu);
            
            
            //浮动菜单点击事件
            dojo.connect(this._floatMenu, "onclick", dojo.hitch(this, function(event){
                var src = event.srcElement;
                var idx = src.getAttribute('idx');
                if (idx && !isNaN(idx)) {
                    event.floatNode = this._floatNode;
                    event.tree = this;
                    this._floatItems[idx]._onClick(event);
                }
                dojo.stopEvent(event);
            }));
            
            //浮动菜单鼠标移入事件
            dojo.connect(this._floatMenu, "onmouseenter", dojo.hitch(this, function(event){
                //删除所有含有dijitTreeRowHover样式的树节点
                dojo.query('.dijitTreeRowHover', this.domNode).removeClass('dijitTreeRowHover');
                
                //为当前树节点添加dijitTreeRowHover样式
                var node = dojo.query('.dijitTreeRow', this._floatNode.domNode)[0];
                dojo.addClass(node, "dijitTreeRowHover");
            }));
            
            //树节点鼠标移入事件
            dojo.connect(this, "onMouseOver", function(event){
                var target = event.target;
                var from = event.fromElement;
                
                //如果是浮动菜单
                if (dojo.hasClass(target, 'dijitTree-float-menu') || target.hasAttribute('idx')) {
                    return;
                }
                var pos = dojo.position(target);
                this._floatMenu.style.top = (pos.y + 6) + "px";
                this._floatNode = dijit.getEnclosingWidget(target)
                
                
                for (var i = 0; i < this._floatItems.length; i++) {
                    var item = this._floatItems[i];
                    dojo.mixin(event, {
                        floatNode: this._floatNode,
                        floatItem: item,
                        tree: this
                    });
                    var nodeMouseOver = this._floatItems[i]._onTreeNodeMouseOver;
                    dojo.isFunction(nodeMouseOver) && nodeMouseOver(event);
                    
                }
                
            });
            
            
            //树控件鼠标移出事件
            dojo.connect(this, "onMouseLeave", function(event){
                dojo.style(this._floatMenu, "display", "none");
                
            });
            
            //树控件鼠标移入事件
            dojo.connect(this, "onMouseEnter", function(event){
                dojo.style(this._floatMenu, "display", "inline-block");
            });
            
        }
    });
    
});
