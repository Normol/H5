/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-27 15:43:49
 * @LastEditTime: 2019-09-27 15:57:28
 * @LastEditors: Please set LastEditors
 */
const data = {
  // 测试rebase
  tabs: [
    { name: "1" },
    { name: "2" },
    { name: "3" },
    { name: "4" },
    { name: "5" },
    { name: "6" },
    { name: "7" },
    { name: "8" },
    { name: "9" },
    { name: "10" },
    { name: "11" }
  ],
  content: [
    { name: "1", text: "1" },
    { name: "2", text: "2" },
    { name: "3", text: "3" },
    { name: "4", text: "4" },
    { name: "5", text: "5" },
    { name: "6", text: "6" },
    { name: "7", text: "7" },
    { name: "8", text: "8" },
    { name: "9", text: "9" },
    { name: "10", text: "10" },
    { name: "11", text: "11" }
  ]
};
if (1 < 2) {
  console.log(1);
}
// 模板渲染tabs值
const tab = template("tpl-tabs", data);
$(".nav-tabs").html(tab);

//模板渲染tabsContent值
const tabContent = template("tpl-tabs-content", data);
$(".tab-content").html(tabContent);

// 模板渲染下拉tabas值
const tabDown = template("tpl-tabs-down-content", data);
$(".tabs_down_content").html(tabDown);

$(function() {
  // 切换tab
  $(".nav-li").on("click", function(e) {
    const name = $(e.target).text();
    const tar = $(e.target).parent();
    $(".nav-tabs").prepend(tar);
    switchTabContent(name);
  });

  // 切换下拉框tab
  $(".tabs_down_item").click(function(e) {
    const name = $(e.target).text();
    const tabsChild = $(".nav-tabs").children();
    tabsChild.each(function(i, child) {
      const childItem = $(child);
      const childItemText = childItem.children().text();
      if (childItem.hasClass("active") && childItemText == name) {
        return;
      } else if (childItemText == name && !childItem.hasClass("active")) {
        $(".nav-tabs").prepend(childItem);
        childItem.addClass("active");
      } else {
        childItem.removeClass("active");
      }
    });
    switchTabContent(name);
    selectUp();
  });

  // tab_content切换
  function switchTabContent(name) {
    const contentChild = $(".tab-content").children();
    contentChild.each(function(i, item) {
      let ctx = $(item);
      if (ctx.attr("id") === name && !ctx.hasClass("active")) {
        ctx.addClass("active");
      } else if (ctx.attr("id") !== name && ctx.hasClass("active")) {
        ctx.removeClass("active");
      }
    });
  }

  // 下拉 收起
  $(".tab_icon").click(function() {
    const type = $(this).hasClass("down");
    if (type) {
      $(".tab_icon>img").attr("src", "../img/select-up.png");
      $(this).removeClass("down");
      $(".tabs_down_content")
        .show()
        .addClass("tabs_down_content_flex")
        .css("display", "flex");
    } else {
      selectUp();
    }
  });

  // 收起下拉框
  function selectUp() {
    $(".tab_icon").addClass("down");
    $(".tab_icon>img").attr("src", "../img/select-down.png");
    $(".tabs_down_content")
      .hide()
      .removeClass("tabs_down_content_flex");
  }
});

let a = "test1";
